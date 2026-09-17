import { NextRequest, NextResponse } from 'next/server';
import { getSlotOverview } from '@/lib/db';
import { DEFAULT_SLOTS } from '@/lib/slots';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Параметр date обязателен в формате YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const slotNames = DEFAULT_SLOTS.map((s) => s.time);
    const overview = getSlotOverview(date, slotNames);

    return NextResponse.json({
      date,
      slots: overview,
    });
  } catch (err: any) {
    console.error('API /api/slots error:', err);
    return NextResponse.json(
      { error: 'Ошибка получения слотов' },
      { status: 500 }
    );
  }
}
