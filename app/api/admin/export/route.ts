import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings } from '@/lib/db';
import { generateBookingsExcel } from '@/lib/export-excel';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'AtmoS22F';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const authHeader = req.headers.get('authorization');

    // Simple robust authorization for accountant
    const isAuthorized =
      key === ADMIN_SECRET ||
      (authHeader && authHeader.replace(/^Bearer\s+/i, '') === ADMIN_SECRET);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Доступ запрещен. Укажите корректный ключ авторизации (параметр ?key=... или заголовок Authorization)' },
        { status: 401 }
      );
    }

    const date = searchParams.get('date') || undefined;
    const bookings = getAllBookings(date);

    const buffer = generateBookingsExcel(bookings);
    const filename = `atmos_bookings_${date || 'all'}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(buffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: any) {
    console.error('Export error:', err);
    return NextResponse.json(
      { error: 'Ошибка генерации отчета Excel' },
      { status: 500 }
    );
  }
}
