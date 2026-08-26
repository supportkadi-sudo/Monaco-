import { Bot } from 'grammy';
import { updateBookingStatus } from '@/lib/booking/service';
import { callbackPattern, parseBookingCallback } from '@/lib/telegram/callback';
import { syncBookingTelegramMessages, telegramAdminIds } from '@/lib/telegram/notify';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error('TELEGRAM_BOT_TOKEN is required');

const allowedAdmins = new Set(telegramAdminIds());
const bot = new Bot(token);

bot.use(async (ctx, next) => {
  const chatId = ctx.chat?.id ? String(ctx.chat.id) : '';
  const userId = ctx.from?.id ? String(ctx.from.id) : '';

  // Admin IDs are expected to be private Telegram chat/user IDs. Requiring both
  // values prevents an arbitrary member of an allowed group chat from using
  // administrative callbacks.
  if (!allowedAdmins.has(chatId) || !allowedAdmins.has(userId)) return;
  await next();
});

bot.command('start', (ctx) => ctx.reply('Monaco Admin Bot готов принимать заявки.'));

bot.callbackQuery(callbackPattern, async (ctx) => {
  const parsed = parseBookingCallback(ctx.callbackQuery.data);
  if (!parsed) {
    await ctx.answerCallbackQuery({ text: 'Некорректная команда', show_alert: true });
    return;
  }

  try {
    await updateBookingStatus(parsed.bookingId, parsed.status);
    await syncBookingTelegramMessages(parsed.bookingId);
    await ctx.answerCallbackQuery({ text: 'Статус обновлён' });
  } catch (error) {
    console.error(error);
    await ctx.answerCallbackQuery({ text: 'Не удалось обновить статус', show_alert: true });
  }
});

bot.catch((error) => console.error('Telegram bot error', error.error));
bot.start({ onStart: () => console.log('Monaco Telegram bot started') });
