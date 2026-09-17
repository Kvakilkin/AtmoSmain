import assert from 'node:assert';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import * as XLSX from 'xlsx';

console.log('🏁 Запуск комплексного тестирования системы бронирования «АТМОС»...');

// 1. Проверка логики лимитов слотов (до 14:00 -> 10, после 14:00 -> 5)
function getSlotCapacity(timeSlot) {
  const hourMatch = timeSlot.match(/^(\d{1,2}):/);
  if (hourMatch) {
    const hour = parseInt(hourMatch[1], 10);
    return hour < 14 ? 10 : 5;
  }
  return 5;
}

assert.strictEqual(getSlotCapacity('09:30 - 11:00'), 10, 'Слот 09:30 должен иметь лимит 10');
assert.strictEqual(getSlotCapacity('11:00 - 12:30'), 10, 'Слот 11:00 должен иметь лимит 10');
assert.strictEqual(getSlotCapacity('13:30 - 15:00'), 10, 'Слот 13:30 должен иметь лимит 10');

assert.strictEqual(getSlotCapacity('15:00 - 16:30'), 5, 'Слот 15:00 должен иметь лимит 5');
assert.strictEqual(getSlotCapacity('16:30 - 18:00'), 5, 'Слот 16:30 должен иметь лимит 5');
assert.strictEqual(getSlotCapacity('18:00 - 19:30'), 5, 'Слот 18:00 должен иметь лимит 5');
console.log('✅ 1. Проверка дифференцированных лимитов слотов пройдена успешно (10 до 14:00, 5 после 14:00).');

// 2. Инициализация тестовой in-memory БД SQLite
const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER NOT NULL,
    date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    is_minor INTEGER NOT NULL DEFAULT 0,
    consent_152 INTEGER NOT NULL DEFAULT 1,
    ip_address TEXT,
    created_at TEXT NOT NULL
  );
`);

function createBooking(data) {
  const capacity = getSlotCapacity(data.timeSlot);
  db.exec('BEGIN IMMEDIATE');
  try {
    const countRes = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE date = ? AND time_slot = ?').get(data.date, data.timeSlot);
    const count = countRes?.count || 0;
    if (count >= capacity) {
      db.exec('ROLLBACK');
      return { success: false, error: 'SLOT_FULL' };
    }

    const dup = db.prepare('SELECT id FROM bookings WHERE phone = ? AND date = ? AND time_slot = ?').get(data.phone, data.date, data.timeSlot);
    if (dup) {
      db.exec('ROLLBACK');
      return { success: false, error: 'DUPLICATE_PHONE' };
    }

    const insert = db.prepare(`
      INSERT INTO bookings (full_name, phone, age, date, time_slot, is_minor, consent_152, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);
    const isMinor = data.age < 18 ? 1 : 0;
    const res = insert.run(data.fullName, data.phone, data.age, data.date, data.timeSlot, isMinor, data.ipAddress || '127.0.0.1', new Date().toISOString());
    db.exec('COMMIT');
    return { success: true, bookingId: Number(res.lastInsertRowid) };
  } catch (err) {
    db.exec('ROLLBACK');
    return { success: false, error: err.message };
  }
}

// 3. Тестирование лимита для слота после 14:00 (15:00 - 16:30) -> максимум 5 человек
const testDate = '2025-05-17';
const eveningSlot = '15:00 - 16:30';

for (let i = 1; i <= 5; i++) {
  const res = createBooking({
    fullName: `Пилот Вечерний ${i}`,
    phone: `+7999000110${i}`,
    age: 20 + i,
    date: testDate,
    timeSlot: eveningSlot,
  });
  assert.strictEqual(res.success, true, `Запись ${i} должна быть успешной`);
}

// Попытка записать 6-го человека на слот 15:00 -> ДОЛЖНА БЫТЬ ОТКЛОНЕНА!
const rejectEvening = createBooking({
  fullName: 'Лишний Пилот 6',
  phone: '+79990001199',
  age: 25,
  date: testDate,
  timeSlot: eveningSlot,
});
assert.strictEqual(rejectEvening.success, false, '6-я запись на вечерний слот должна быть отклонена');
assert.strictEqual(rejectEvening.error, 'SLOT_FULL', 'Ошибка должна быть SLOT_FULL');
console.log('✅ 2. Тест строгого лимита для слота после 14:00 пройден (строго 5 мест, 6-й отклонен).');

// 4. Тестирование лимита для утреннего слота (09:30 - 11:00) -> максимум 10 человек
const morningSlot = '09:30 - 11:00';
for (let i = 1; i <= 10; i++) {
  const res = createBooking({
    fullName: `Пилот Утренний ${i}`,
    phone: `+799911122${i.toString().padStart(2, '0')}`,
    age: i === 1 ? 14 : 22, // Проверяем и несовершеннолетнего
    date: testDate,
    timeSlot: morningSlot,
  });
  assert.strictEqual(res.success, true, `Утренняя запись ${i} должна быть успешной`);
}

// Попытка записать 11-го человека на слот 10:00 -> ДОЛЖНА БЫТЬ ОТКЛОНЕНА!
const rejectMorning = createBooking({
  fullName: 'Лишний Пилот 11',
  phone: '+79991112299',
  age: 28,
  date: testDate,
  timeSlot: morningSlot,
});
assert.strictEqual(rejectMorning.success, false, '11-я запись на утренний слот должна быть отклонена');
assert.strictEqual(rejectMorning.error, 'SLOT_FULL', 'Ошибка должна быть SLOT_FULL');
console.log('✅ 3. Тест строгого лимита для слота до 14:00 пройден (строго 10 мест, 11-й отклонен).');

// 5. Тестирование защиты от повторной записи одного телефона на один слот
const duplicateAttempt = createBooking({
  fullName: 'Повторный Запрос',
  phone: '+79990001101', // Тот же телефон, что уже записан
  age: 30,
  date: testDate,
  timeSlot: eveningSlot,
});
assert.strictEqual(duplicateAttempt.success, false);
console.log('✅ 4. Тест защиты от дублирования телефона на один слот пройден.');

// 6. Тестирование генерации Excel (.xlsx) для бухгалтера
const allBookings = db.prepare('SELECT * FROM bookings').all();
assert.strictEqual(allBookings.length, 15, 'В базе должно быть ровно 15 записей (5 вечер + 10 утро)');

const excelRows = allBookings.map((b) => ({
  'ID': b.id,
  'Дата': b.date,
  'Слот': b.time_slot,
  'ФИО': b.full_name,
  'Телефон': b.phone,
  'Возраст': b.age,
  'Статус': b.is_minor ? 'Несовершеннолетний (<18)' : 'Взрослый',
  '152-ФЗ': 'Согласие получено',
}));

const worksheet = XLSX.utils.json_to_sheet(excelRows);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Записи');
const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

assert.ok(buffer.length > 1000, 'Excel буфер должен содержать бинарные данные XLSX');
console.log(`✅ 5. Тест экспорта в Excel (.xlsx) пройден: сформирован файл размером ${buffer.length} байт.`);

// 7. Тестирование запрета записи на воскресенье и понедельник
function isDayAllowed(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday
  return dayOfWeek !== 0 && dayOfWeek !== 1;
}

// 2025-05-18 - Воскресенье (должно быть запрещено)
assert.strictEqual(isDayAllowed('2025-05-18'), false, 'Воскресенье должно быть запрещено');
// 2025-05-19 - Понедельник (должно быть запрещено)
assert.strictEqual(isDayAllowed('2025-05-19'), false, 'Понедельник должен быть запрещен');
// 2025-05-20 - Вторник (разрешено)
assert.strictEqual(isDayAllowed('2025-05-20'), true, 'Вторник должен быть разрешен');
// 2025-05-24 - Суббота (разрешено)
assert.strictEqual(isDayAllowed('2025-05-24'), true, 'Суббота должна быть разрешена');
console.log('✅ 6. Тест запрета бронирования на понедельник и воскресенье пройден (разрешены Вт-Сб).');

console.log('🎉 ВСЕ 6 АВТОМАТИЧЕСКИХ ТЕСТОВ УСПЕШНО ПРОЙДЕНЫ!');

