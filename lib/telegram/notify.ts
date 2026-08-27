import { Bot, InlineKeyboard } from 'grammy';
import type { Booking } from '@prisma/client';
import { prisma } from '@/lib/db';
import { bookingTelegramText } from './format';

export function telegramAdminIds() {
  return (process.env.TELEGRAM_ADMIN_CHAT_IDS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function keyboard(bookingId: number) {
  return new InlineKeyboard()
    .text('📞 Связались', `booking:CONTACTED:${bookingId}`)
    .text('✅ Подтверждено', `booking:CONFIRMED:${bookingId}`)
    .row()
    .text('❌ Отменено', `booking:CANCELLED:${bookingId}`);
}

export async function notifyAdminsAboutBooking(booking: Booking) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminIds = telegramAdminIds();
  if (!token || adminIds.length === 0) return;

  const bot = new Bot(token);
  const sent: Array<{ chatId: string; messageId: string }> = [];

  for (const chatId of adminIds) {
    try {
      const message = await bot.api.sendMessage(chatId, bookingTelegramText(booking), {
        parse_mode: 'HTML',
        reply_markup: keyboard(booking.id)
      });
      sent.push({ chatId, messageId: String(message.message_id) });
    } catch (error) {
      console.error(`Telegram booking notification failed for chat ${chatId}`, error);
    }
  }

  if (sent.length) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        telegramMessageId: sent[0].messageId,
        telegramMessages: { createMany: { data: sent } }
      }
    });
  }
}

export async function syncBookingTelegramMessages(bookingId: number) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { telegramMessages: true }
  });
  if (!booking) return;

  const bot = new Bot(token);
  for (const message of booking.telegramMessages) {
    try {
      await bot.api.editMessageText(message.chatId, Number(message.messageId), bookingTelegramText(booking), {
        parse_mode: 'HTML',
        reply_markup: keyboard(booking.id)
      });
    } catch (error) {
      console.error('Telegram message sync failed', error);
    }
  }
}
