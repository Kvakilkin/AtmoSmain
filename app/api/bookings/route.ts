import { NextRequest, NextResponse } from 'next/server';
import { BookingSchema, sanitizeString } from '@/lib/validations';
import { createBooking, getSlotCapacity, getBookedCount } from '@/lib/db';
import { sendWebhookNotification } from '@/lib/webhook';

// In-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP determination & Rate Limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

    if (!checkRateLimit(ip, 5, 60000)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Слишком много запросов с вашего IP. Пожалуйста, подождите минуту перед повторной попыткой.',
        },
        { status: 429 }
      );
    }

    // 2. Parse and validate payload
    const body = await req.json();

    const parseResult = BookingSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors[0]?.message || 'Ошибка валидации данных';
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const data = parseResult.data;

    // 3. Honeypot check
    if (data.website && data.website.length > 0) {
      // Quietly reject bot submissions
      return NextResponse.json({ success: false, error: 'Ошибка проверки безопасности' }, { status: 400 });
    }

    // 4. Sanitize inputs to eliminate XSS
    const sanitizedName = sanitizeString(data.fullName);
    const sanitizedPhone = data.phone; // already digits only from schema
    const sanitizedDate = data.date;
    const sanitizedSlot = sanitizeString(data.timeSlot);

    // 5. Pre-check slot capacity before attempting database transaction
    const capacity = getSlotCapacity(sanitizedSlot);
    const booked = getBookedCount(sanitizedDate, sanitizedSlot);
    if (booked >= capacity) {
      return NextResponse.json(
        {
          success: false,
          error: `К сожалению, на слот «${sanitizedSlot}» все места (${capacity} из ${capacity}) уже заняты. Пожалуйста, выберите другое время.`,
        },
        { status: 409 }
      );
    }

    // 6. Execute atomic reservation inside SQLite transaction
    const bookingResult = createBooking({
      fullName: sanitizedName,
      phone: sanitizedPhone,
      age: data.age,
      date: sanitizedDate,
      timeSlot: sanitizedSlot,
      ipAddress: ip,
    });

    if (!bookingResult.success) {
      return NextResponse.json(
        { success: false, error: bookingResult.error || 'Не удалось завершить запись.' },
        { status: 400 }
      );
    }

    // Trigger non-blocking webhook sync (Google Sheets / Yandex Tables)
    sendWebhookNotification({
      bookingId: bookingResult.bookingId!,
      fullName: sanitizedName,
      phone: sanitizedPhone,
      age: data.age,
      date: sanitizedDate,
      timeSlot: sanitizedSlot,
      isMinor: data.age < 18,
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      bookingId: bookingResult.bookingId,
      message: 'Вы успешно зарегистрированы на открытый мастер-класс!',
      details: {
        fullName: sanitizedName,
        date: sanitizedDate,
        timeSlot: sanitizedSlot,
        capacity,
      },
    });
  } catch (error: any) {
    console.error('API /api/bookings error:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера. Пожалуйста, повторите позже.' },
      { status: 500 }
    );
  }
}
