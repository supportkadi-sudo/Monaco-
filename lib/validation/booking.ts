import { z } from 'zod';

const uzPhone = /^\+?998\d{9}$/;

export const bookingInputSchema = z.object({
  name: z.string().trim().min(2, 'Укажите имя').max(80),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s()\-]/g, ''))
    .refine((value) => uzPhone.test(value), 'Введите номер в формате +998 XX XXX XX XX')
    .transform((value) => (value.startsWith('+') ? value : `+${value}`)),
  visitDate: z
    .string()
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), 'Укажите дату')
    .refine((value) => {
      const selected = new Date(`${value}T00:00:00+05:00`);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return !Number.isNaN(selected.getTime()) && selected >= now;
    }, 'Дата посещения не может быть в прошлом'),
  adults: z.coerce.number().int().min(0).max(30),
  children: z.coerce.number().int().min(0).max(30),
  comment: z.string().trim().max(1000).optional().or(z.literal('')),
  website: z.string().max(0).optional().default('')
}).refine((data) => data.adults + data.children > 0, {
  message: 'Укажите хотя бы одного гостя',
  path: ['adults']
});

export type BookingInput = z.infer<typeof bookingInputSchema>;
