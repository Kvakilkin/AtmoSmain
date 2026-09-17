export interface SlotConfig {
  id: string;
  time: string;
  isMorning: boolean; // true if before 14:00
  capacity: number;
}

export const DEFAULT_SLOTS: SlotConfig[] = [
  // Before 14:00: Strict limit 10 seats
  { id: 'slot-1', time: '09:30 - 11:00', isMorning: true, capacity: 10 },
  { id: 'slot-2', time: '11:00 - 12:30', isMorning: true, capacity: 10 },
  { id: 'slot-3', time: '13:30 - 15:00', isMorning: true, capacity: 10 },

  // From 14:00 onwards: Strict limit 5 seats
  { id: 'slot-4', time: '15:00 - 16:30', isMorning: false, capacity: 5 },
  { id: 'slot-5', time: '16:30 - 18:00', isMorning: false, capacity: 5 },
  { id: 'slot-6', time: '18:00 - 19:30', isMorning: false, capacity: 5 },
];

export function getAvailableDates(): Array<{ date: string; label: string; weekday: string; isHot?: boolean }> {
  // Generate next upcoming weekend dates for the open master-classes
  return [
    { date: '2025-05-17', label: '17 мая 2025', weekday: 'Суббота', isHot: true },
    { date: '2025-05-18', label: '18 мая 2025', weekday: 'Воскресенье' },
    { date: '2025-05-24', label: '24 мая 2025', weekday: 'Суббота' },
    { date: '2025-05-25', label: '25 мая 2025', weekday: 'Воскресенье' },
  ];
}
