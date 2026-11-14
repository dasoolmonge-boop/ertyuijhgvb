import dotenv from 'dotenv';
dotenv.config();

function getBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token.trim() === '' || token.includes('your_telegram_bot_token')) {
    return null;
  }
  return token.trim();
}

export function getAdminIds() {
  const raw = process.env.TELEGRAM_ADMIN_IDS || process.env.TELEGRAM_ADMIN || '';
  return raw
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0 && !isNaN(Number(id)));
}

// Escape HTML special characters for Telegram HTML parse_mode
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendTelegramMessage(chatId, text) {
  const token = getBotToken();
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN не задан в переменных окружения.');
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    const errorDesc = data.description || `HTTP ${response.status}`;
    // If bot was blocked or chat not found, provide helpful guidance in log without exposing token
    throw new Error(`Telegram API Error (chat_id: ${chatId}): ${errorDesc}`);
  }
  return data;
}

export async function broadcastToAdmins(messageText) {
  const adminIds = getAdminIds();
  if (adminIds.length === 0) {
    console.warn('[Telegram] Внимание: TELEGRAM_ADMIN_IDS не настроены или пусты.');
    return { success: false, deliveredCount: 0, errors: ['Администраторы не настроены в TELEGRAM_ADMIN_IDS'] };
  }

  const results = await Promise.allSettled(
    adminIds.map(adminId => sendTelegramMessage(adminId, messageText))
  );

  const errors = [];
  let deliveredCount = 0;

  results.forEach((res, index) => {
    if (res.status === 'fulfilled') {
      deliveredCount++;
    } else {
      errors.push(`Admin ${adminIds[index]}: ${res.reason?.message || 'Failed'}`);
    }
  });

  return {
    success: deliveredCount > 0,
    deliveredCount,
    totalAdmins: adminIds.length,
    errors,
  };
}

// Format Order Notification
export function formatOrderMessage(order) {
  const dateFormatted = new Date(order.createdAt).toLocaleString('ru-RU', {
    timeZone: 'Asia/Krasnoyarsk',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemsFormatted = order.items
    .map((item, i) => {
      const priceStr = item.price > 0 ? `${item.price.toLocaleString('ru-RU')} ₽` : item.priceText || 'По согласованию';
      return `${i + 1}. <b>${escapeHtml(item.name)}</b>\n   • Размер: ${escapeHtml(item.size || 'Уточняется')}\n   • Количество: ${item.quantity} шт.\n   • Цена: ${priceStr}`;
    })
    .join('\n\n');

  let msg = `🛍 <b>НОВЫЙ ЗАКАЗ №${order.orderNumber}</b>\n\n`;
  msg += `👤 <b>Покупатель:</b> ${escapeHtml(order.customerName)}\n`;
  msg += `📞 <b>Телефон:</b> <code>${escapeHtml(order.phone)}</code>\n`;
  msg += `📍 <b>Город:</b> ${escapeHtml(order.city)}\n`;

  if (order.address && order.address.trim()) {
    msg += `🏠 <b>Адрес:</b> ${escapeHtml(order.address)}\n`;
  }

  msg += `🚚 <b>Доставка:</b> ${escapeHtml(order.deliveryMethod || 'Курьер / СДЭК')}\n`;
  msg += `💳 <b>Оплата:</b> ${escapeHtml(order.paymentMethod || 'При получении / картой')}\n`;

  if (order.comment && order.comment.trim()) {
    msg += `📝 <b>Комментарий:</b> <i>${escapeHtml(order.comment)}</i>\n`;
  }

  msg += `\n📦 <b>СОСТАВ ЗАКАЗА:</b>\n${itemsFormatted}\n\n`;
  msg += `💰 <b>ИТОГО:</b> <b>${escapeHtml(order.totalFormatted)}</b>\n`;
  msg += `📅 <b>Дата:</b> ${dateFormatted} (Кызыл)`;

  return msg;
}

// Format Lead / Consultation Notification
export function formatLeadMessage(lead) {
  const dateFormatted = new Date(lead.createdAt).toLocaleString('ru-RU', {
    timeZone: 'Asia/Krasnoyarsk',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let header = '💬 <b>НОВОЕ ОБРАЩЕНИЕ</b>';
  if (lead.type === 'callback') {
    header = '📞 <b>ЗАЯВКА НА ОБРАТНЫЙ ЗВОНОК</b>';
  } else if (lead.type === 'consultation') {
    header = '📏 <b>ЗАПРОС КОНСУЛЬТАЦИИ ПО РАЗМЕРУ</b>';
  } else if (lead.type === 'feedback') {
    header = '✉️ <b>СООБЩЕНИЕ ИЗ ФОРМЫ СВЯЗИ</b>';
  }

  let msg = `${header}\n\n`;
  msg += `👤 <b>Имя:</b> ${escapeHtml(lead.name)}\n`;
  msg += `📞 <b>Телефон:</b> <code>${escapeHtml(lead.phone)}</code>\n`;

  if (lead.productName) {
    msg += `🧥 <b>Товар:</b> ${escapeHtml(lead.productName)}\n`;
  }

  if (lead.message && lead.message.trim()) {
    msg += `💬 <b>Вопрос / комментарий:</b>\n<i>${escapeHtml(lead.message)}</i>\n`;
  }

  msg += `\n📅 <b>Время:</b> ${dateFormatted} (Кызыл)`;
  return msg;
}
