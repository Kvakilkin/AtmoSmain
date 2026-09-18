import fs from 'fs';
import path from 'path';

// Using Node.js 22+ built-in SQLite DatabaseSync
// This requires zero external compilation or native binaries on Windows!
let dbInstance: any = null;

export interface BookingRecord {
  id: number;
  full_name: string;
  phone: string;
  age: number;
  date: string;
  time_slot: string;
  branch: string;
  is_minor: number;
  consent_152: number;
  ip_address: string;
  created_at: string;
}

export function getSlotCapacity(timeSlot: string): number {
  // Slots before 14:00 have a limit of 10 participants
  // Slots at or after 14:00 have a strict limit of 5 participants
  const hourMatch = timeSlot.match(/^(\d{1,2}):/);
  if (hourMatch) {
    const hour = parseInt(hourMatch[1], 10);
    return hour < 14 ? 10 : 5;
  }
  return 5; // Safe default
}

export function getDatabase() {
  if (dbInstance) return dbInstance;

  try {
    // Dynamic require to prevent bundling issues in edge or client contexts
    const { DatabaseSync } = require('node:sqlite');
    
    const isVercel = Boolean(process.env.VERCEL);
    const dbDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.join(dbDir, 'bookings.db');
    dbInstance = new DatabaseSync(dbPath);

    // Optimize SQLite with WAL mode for high concurrency & speed
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA synchronous = NORMAL;');

    // Create bookings table with parameterized indexes
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        age INTEGER NOT NULL,
        date TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        branch TEXT NOT NULL DEFAULT 'main',
        is_minor INTEGER NOT NULL DEFAULT 0,
        consent_152 INTEGER NOT NULL DEFAULT 1,
        ip_address TEXT,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_bookings_date_slot ON bookings (date, time_slot);
      CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings (phone);
    `);

    // Migration: ensure branch column exists if table was created previously
    try {
      const tableInfo = dbInstance.prepare("PRAGMA table_info(bookings)").all() as Array<{ name: string }>;
      const hasBranch = tableInfo.some((col: any) => col.name === 'branch');
      if (!hasBranch) {
        dbInstance.exec("ALTER TABLE bookings ADD COLUMN branch TEXT NOT NULL DEFAULT 'main';");
      }
    } catch (e) {
      console.error('Migration pragma check notice:', e);
    }

    // Now safely create index on branch
    dbInstance.exec(`
      CREATE INDEX IF NOT EXISTS idx_bookings_branch ON bookings (branch);
    `);

    return dbInstance;
  } catch (err) {
    console.error('Failed to initialize native SQLite database:', err);
    throw err;
  }
}

/**
 * Returns the count of booked seats for a specific date, time slot, and branch
 */
export function getBookedCount(date: string, timeSlot: string, branch = 'main'): number {
  const db = getDatabase();
  const stmt = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE date = ? AND time_slot = ? AND branch = ?');
  const result = stmt.get(date, timeSlot, branch) as { count: number } | undefined;
  return result?.count ?? 0;
}

/**
 * Returns slot occupancy overview for a given date and branch
 */
export function getSlotOverview(date: string, availableSlots: string[], branch = 'main') {
  const db = getDatabase();
  const stmt = db.prepare('SELECT time_slot, COUNT(*) as count FROM bookings WHERE date = ? AND branch = ? GROUP BY time_slot');
  const rows = stmt.all(date, branch) as Array<{ time_slot: string; count: number }>;
  
  const countMap = new Map<string, number>();
  for (const row of rows) {
    countMap.set(row.time_slot, row.count);
  }

  return availableSlots.map((slot) => {
    const booked = countMap.get(slot) || 0;
    const capacity = getSlotCapacity(slot);
    const available = Math.max(0, capacity - booked);
    return {
      slot,
      capacity,
      booked,
      available,
      isFull: available <= 0,
      isLow: available > 0 && available <= 2,
    };
  });
}

/**
 * Atomic reservation with strict concurrency control (Prevents Race Conditions)
 */
export function createBooking(data: {
  fullName: string;
  phone: string;
  age: number;
  date: string;
  timeSlot: string;
  branch?: string;
  ipAddress: string;
}): { success: boolean; bookingId?: number; error?: string } {
  const db = getDatabase();
  const branch = data.branch || 'main';
  const capacity = getSlotCapacity(data.timeSlot);

  // Use explicit BEGIN IMMEDIATE to lock writing and prevent race conditions
  db.exec('BEGIN IMMEDIATE');

  try {
    // 1. Check current capacity inside transaction for this specific branch
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE date = ? AND time_slot = ? AND branch = ?');
    const res = countStmt.get(data.date, data.timeSlot, branch) as { count: number };
    const currentCount = res?.count || 0;

    if (currentCount >= capacity) {
      db.exec('ROLLBACK');
      return {
        success: false,
        error: `Все места на слот ${data.timeSlot} уже забронированы (${capacity} из ${capacity})`
      };
    }

    // 2. Check if this phone number is already registered for this specific date, slot, and branch
    const duplicateStmt = db.prepare('SELECT id FROM bookings WHERE phone = ? AND date = ? AND time_slot = ? AND branch = ?');
    const existing = duplicateStmt.get(data.phone, data.date, data.timeSlot, branch);
    if (existing) {
      db.exec('ROLLBACK');
      return {
        success: false,
        error: 'По данному номеру телефона уже оформлена запись на этот слот в этом филиале.'
      };
    }

    // 3. Insert new booking with parameterized statement
    const insertStmt = db.prepare(`
      INSERT INTO bookings (full_name, phone, age, date, time_slot, branch, is_minor, consent_152, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);

    const isMinor = data.age < 18 ? 1 : 0;
    const createdAt = new Date().toISOString();

    const insertResult = insertStmt.run(
      data.fullName.trim(),
      data.phone.trim(),
      data.age,
      data.date,
      data.timeSlot,
      branch,
      isMinor,
      data.ipAddress,
      createdAt
    );

    db.exec('COMMIT');
    return {
      success: true,
      bookingId: Number(insertResult.lastInsertRowid),
    };
  } catch (err: any) {
    db.exec('ROLLBACK');
    console.error('Transaction failed during booking creation:', err);
    return {
      success: false,
      error: 'Ошибка базы данных при оформлении бронирования. Попробуйте еще раз.'
    };
  }
}

/**
 * Get all bookings (with optional date and branch filter) for admin & export
 */
export function getAllBookings(dateFilter?: string, branchFilter?: string): BookingRecord[] {
  const db = getDatabase();
  let query = 'SELECT * FROM bookings';
  const params: any[] = [];
  const conditions: string[] = [];

  if (dateFilter) {
    conditions.push('date = ?');
    params.push(dateFilter);
  }

  if (branchFilter && branchFilter !== 'all') {
    conditions.push('branch = ?');
    params.push(branchFilter);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY date ASC, time_slot ASC, id ASC';
  const stmt = db.prepare(query);
  return stmt.all(...params) as BookingRecord[];
}

/**
 * Delete a booking by ID (Admin / Accountant action)
 */
export function deleteBooking(id: number): boolean {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM bookings WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}
