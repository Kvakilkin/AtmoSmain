import { z } from 'zod';

export function sanitizeString(str: string): string {
  if (!str) return '';
  return str
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&#39;';
        case '"': return '&quot;';
        case '&': return '&amp;';
        default: return char;
      }
    })
    .trim();
}

export const BookingSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'ФИО должно содержать не менее 3 символов' })
    .max(100, { message: 'ФИО слишком длинное' })
    .regex(/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/, {
      message: 'ФИО может содержать только буквы, дефисы и пробелы',
    }),
  phone: z
    .string()
    .min(10, { message: 'Некорректный номер телефона' })
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 11 && (val.startsWith('7') || val.startsWith('8')), {
      message: 'Введите корректный российский номер телефона (+7 ...)',
    }),
  age: z
    .number({ invalid_type_error: 'Укажите возраст числом' })
    .min(7, { message: 'Минимальный возраст участника — 7 лет' })
    .max(99, { message: 'Максимальный возраст участника — 99 лет' }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Неверный формат даты (ГГГГ-ММ-ДД)' })
    .refine(
      (val) => {
        const [year, month, day] = val.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday
        return dayOfWeek !== 0 && dayOfWeek !== 1;
      },
      {
        message: 'Понедельник и воскресенье являются техническими днями. Выберите дату со вторника по субботу.',
      }
    ),
  timeSlot: z
    .string()
    .min(5, { message: 'Выберите временной слот' }),
  consent152: z
    .literal(true, {
      errorMap: () => ({ message: 'Необходимо согласие на обработку персональных данных (152-ФЗ)' }),
    }),
  // Honeypot for bot detection
  website: z.string().max(0, { message: 'Spam detected' }).optional().or(z.literal('')),
});

export type BookingInput = z.infer<typeof BookingSchema>;
