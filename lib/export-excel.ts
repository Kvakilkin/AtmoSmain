import * as XLSX from 'xlsx';
import { BookingRecord, getSlotCapacity } from './db';

export function generateBookingsExcel(bookings: BookingRecord[]): Buffer {
  // 1. Transform raw records into human-readable table for accountants
  const data = bookings.map((b) => {
    const isMinorText = b.is_minor ? 'Да (<18 лет, с родителями)' : 'Взрослый (18+)';
    const capacity = getSlotCapacity(b.time_slot);
    
    // Format Russian phone display
    let formattedPhone = b.phone;
    if (b.phone.length === 11) {
      formattedPhone = `+7 (${b.phone.slice(1, 4)}) ${b.phone.slice(4, 7)}-${b.phone.slice(7, 9)}-${b.phone.slice(9, 11)}`;
    }

    // Format registration date
    const createdDate = new Date(b.created_at);
    const formattedCreated = createdDate.toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      'ID': b.id,
      'Дата мастер-класса': b.date,
      'Временной слот': b.time_slot,
      'Лимит слота': `${capacity} мест`,
      'ФИО Участника': b.full_name,
      'Телефон': formattedPhone,
      'Возраст': b.age,
      'Статус': isMinorText,
      '152-ФЗ': b.consent_152 ? 'Согласие получено' : 'Нет',
      'Дата записи (МСК)': formattedCreated,
    };
  });

  // 2. Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 3. Set custom column widths for pristine accountant printing/viewing
  worksheet['!cols'] = [
    { wch: 6 },  // ID
    { wch: 14 }, // Дата
    { wch: 18 }, // Слот
    { wch: 12 }, // Лимит
    { wch: 32 }, // ФИО
    { wch: 22 }, // Телефон
    { wch: 10 }, // Возраст
    { wch: 28 }, // Статус
    { wch: 18 }, // 152-ФЗ
    { wch: 20 }, // Дата записи
  ];

  // 4. Create workbook and append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Записи на мастер-класс');

  // 5. Generate binary buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}
