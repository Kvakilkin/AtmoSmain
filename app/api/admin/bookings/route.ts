import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, deleteBooking } from '@/lib/db';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'AtmoS22F';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const authHeader = req.headers.get('authorization');

    const isAuthorized =
      key === ADMIN_SECRET ||
      (authHeader && authHeader.replace(/^Bearer\s+/i, '') === ADMIN_SECRET);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 401 }
      );
    }

    const date = searchParams.get('date') || undefined;
    const branch = searchParams.get('branch') || undefined;
    const bookings = getAllBookings(date, branch);

    return NextResponse.json({
      success: true,
      total: bookings.length,
      bookings,
    });
  } catch (err: any) {
    console.error('Admin bookings error:', err);
    return NextResponse.json(
      { error: 'Ошибка получения записей' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const idParam = searchParams.get('id');
    const authHeader = req.headers.get('authorization');

    const isAuthorized =
      key === ADMIN_SECRET ||
      (authHeader && authHeader.replace(/^Bearer\s+/i, '') === ADMIN_SECRET);

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 401 });
    }

    if (!idParam) {
      return NextResponse.json({ error: 'Параметр id обязателен' }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Неверный ID записи' }, { status: 400 });
    }

    const deleted = deleteBooking(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Запись участника успешно удалена',
      deletedId: id,
    });
  } catch (err: any) {
    console.error('Admin delete error:', err);
    return NextResponse.json(
      { error: 'Ошибка при удалении записи' },
      { status: 500 }
    );
  }
}
