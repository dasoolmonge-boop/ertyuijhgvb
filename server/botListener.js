import dotenv from 'dotenv';
dotenv.config();

import { getAdminIds, formatOrderMessage } from './telegram.js';
import { getOrders, updateOrderNotification } from './db.js';

let isPolling = false;
let lastUpdateId = 0;

function getBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token.trim() === '' || token.includes('your_telegram_bot_token')) {
    return null;
  }
  return token.trim();
}

async function sendReply(chatId, text) {
  const token = getBotToken();
  if (!token) return;

  try {
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    };

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error(`[Telegram Bot] Error sending message to ${chatId}:`, err.message);
  }
}

async function handleUpdate(update) {
  const message = update.message;
  if (!message || !message.text) return;

  const chatId = String(message.chat.id);
  const text = message.text.trim();
  const adminIds = getAdminIds();
  const isAdmin = adminIds.includes(chatId);

  if (text.startsWith('/start')) {
    if (isAdmin) {
      await sendReply(
        chatId,
        `👋 <b>Здравствуйте, администратор!</b>\n\n` +
        `✅ Вы успешно авторизованы в системе магазина <b>KUZEL</b>.\n` +
        `Сюда будут мгновенно поступать все новые заказы, заявки на обратный звонок и вопросы по размерам от покупателей.\n\n` +
        `<b>Команды:</b>\n` +
        `/orders — последние заказы\n` +
        `/help — справка`
      );

      // Check and deliver any pending orders that arrived before admin clicked start
      const orders = await getOrders();
      const pendingOrders = orders.filter(o => !o.telegramNotification?.sent);
      if (pendingOrders.length > 0) {
        await sendReply(
          chatId,
          `🔔 <b>Обнаружено ${pendingOrders.length} неотправленных заказов. Доставляю...</b>`
        );
        for (const ord of pendingOrders) {
          const msg = formatOrderMessage(ord);
          await sendReply(chatId, msg);
          await updateOrderNotification(ord.id, { sent: true, error: null });
        }
      }
    } else {
      await sendReply(
        chatId,
        `👋 <b>Добро пожаловать в KUZEL!</b>\n\n` +
        `Мы создаём премиальную тувинскую национальную одежду.\n` +
        `Сайт магазина: http://localhost:5173/\n` +
        `Instagram: @kuzel.shop\n\n` +
        `<i>Ваш Telegram ID: <code>${chatId}</code></i>`
      );
    }
  } else if (text === '/orders') {
    if (!isAdmin) {
      await sendReply(chatId, '⛔ Доступ запрещен. Эта команда доступна только администраторам магазина.');
      return;
    }

    const orders = await getOrders();
    if (orders.length === 0) {
      await sendReply(chatId, '📦 В базе пока нет заказов.');
      return;
    }

    const recent = orders.slice(-5).reverse();
    let reply = `📦 <b>ПОСЛЕДНИЕ ${recent.length} ЗАКАЗОВ:</b>\n\n`;

    recent.forEach((ord) => {
      const date = new Date(ord.createdAt).toLocaleDateString('ru-RU');
      reply += `<b>Заказ №${ord.orderNumber}</b> (${date})\n`;
      reply += `👤 ${ord.customerName} | 📞 <code>${ord.phone}</code>\n`;
      reply += `📍 ${ord.city} | 💰 ${ord.totalFormatted}\n`;
      reply += `Товаров: ${ord.items?.length || 0} шт.\n\n`;
    });

    await sendReply(chatId, reply);
  } else if (text === '/help') {
    if (isAdmin) {
      await sendReply(
        chatId,
        `ℹ️ <b>Панель администратора KUZEL</b>\n\n` +
        `/start — проверить статус бота и получить ожидающие заказы\n` +
        `/orders — список последних заказов\n\n` +
        `Бот автоматически присылает уведомление при любом заказе или заявке с сайта.`
      );
    } else {
      await sendReply(chatId, 'Свяжитесь с нами через Instagram @kuzel.shop или оформите заказ на сайте.');
    }
  }
}

export async function startBotPolling() {
  const token = getBotToken();
  if (!token) {
    console.warn('[Telegram Polling] Токен бота не задан, long-polling отключен.');
    return;
  }

  if (isPolling) return;
  isPolling = true;

  console.log('[Telegram Polling] Бот начал опрос обновлений (long-polling)...');

  const poll = async () => {
    if (!isPolling) return;

    try {
      const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&timeout=25`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = Math.max(lastUpdateId, update.update_id);
          try {
            await handleUpdate(update);
          } catch (handlerErr) {
            console.error('[Telegram Polling] Ошибка обработки update:', handlerErr.message);
          }
        }
      }
    } catch (err) {
      // Network timeout or temporary glitch: wait 3 seconds and continue
      await new Promise(r => setTimeout(r, 3000));
    }

    if (isPolling) {
      setTimeout(poll, 500);
    }
  };

  poll();
}

export function stopBotPolling() {
  isPolling = false;
}
