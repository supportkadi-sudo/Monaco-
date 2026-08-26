import { z } from 'zod';
import { tashkentDateKey } from '@/lib/date';

const uzPhone = /^\+?998\d{9}$/;
const telegramUsername = /^[A-Za-z0-9_]{5,32}$/;

function normalizeTelegram(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const withoutUrl = trimmed
    .replace(/^https?:\/\/(?:www\.)?t\.me\//i, '')
    .replace(/^t\.me\//i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0];
  return withoutUrl ? `@${withoutUrl}` : '';
}

export const bookingInputSchema = z.object({
  name: z.string().trim().min(2, 'Укажите имя').max(80),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s()\-]/g, ''))
    .refine((value) => uzPhone.test(value), 'Введите номер в формате +998 XX XXX XX XX')
    .transform((value) => (value.startsWith('+') ? value : `+${value}`)),
  telegram: z
    .string()
    .max(120)
    .optional()
    .default('')
    .transform(normalizeTelegram)
    .refine((value) => !value || telegramUsername.test(value.slice(1)), 'Введите Telegram в формате @username'),
  visitDate: z
    .string()
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), 'Укажите дату')
    .refine((value) => value >= tashkentDateKey(), 'Дата посещения не может быть в прошлом'),
  adults: z.coerce.number().int().min(0).max(30),
  children: z.coerce.number().int().min(0).max(30),
  comment: z.string().trim().max(1000).optional().or(z.literal('')),
  website: z.string().max(0).optional().default('')
}).refine((data) => data.adults + data.children > 0, {
  message: 'Укажите хотя бы одного гостя',
  path: ['adults']
});

export type BookingInput = z.infer<typeof bookingInputSchema>;
