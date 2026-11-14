import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import { canonicalProducts } from './catalog.js';
import { saveOrder, updateOrderNotification, saveLead, updateLeadNotification, getOrders } from './db.js';
import { broadcastToAdmins, formatOrderMessage, formatLeadMessage, getAdminIds } from './telegram.js';
import { startBotPolling } from './botListener.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Simple in-memory rate limiter per IP to prevent spam attacks
const rateLimits = new Map();
function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  const current = rateLimits.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > current.resetAt) {
    current.count = 1;
    current.resetAt = now + windowMs;
  } else {
    current.count++;
  }
  rateLimits.set(ip, current);

  if (current.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Слишком много запросов. Пожалуйста, подождите минуту перед повторной отправкой.',
    });
  }
  next();
}

// Clean and sanitize string inputs
function sanitizeString(input, maxLength = 200) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // strip dangerous tags
    .substring(0, maxLength);
}

function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

// API: Health check
app.get('/api/health', (req, res) => {
  const adminIds = getAdminIds();
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    configuredAdminsCount: adminIds.length,
    telegramBotConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
  });
});

// API: Create new customer order
app.post('/api/orders', rateLimitMiddleware, async (req, res) => {
  try {
    const {
      customerName,
      phone,
      city,
      address,
      deliveryMethod,
      paymentMethod,
      comment,
      items,
      privacyConsent,
    } = req.body;

    // Validation
    const sanitizedName = sanitizeString(customerName, 80);
    const sanitizedCity = sanitizeString(city, 80);
    const sanitizedAddress = sanitizeString(address, 200);
    const sanitizedDelivery = sanitizeString(deliveryMethod, 60);
    const sanitizedPayment = sanitizeString(paymentMethod, 60);
    const sanitizedComment = sanitizeString(comment, 500);

    if (!sanitizedName || sanitizedName.length < 2) {
      return res.status(400).json({ success: false, error: 'Пожалуйста, укажите имя и фамилию' });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ success: false, error: 'Пожалуйста, укажите корректный номер телефона' });
    }

    if (!sanitizedCity) {
      return res.status(400).json({ success: false, error: 'Пожалуйста, укажите город доставки' });
    }

    if (!privacyConsent) {
      return res.status(400).json({ success: false, error: 'Необходимо согласие на обработку персональных данных' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Корзина пуста' });
    }

    // Verify each item against canonical catalog to prevent price/name tampering
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const rawItem of items) {
      const canonical = canonicalProducts[rawItem.id];
      const quantity = Math.max(1, Math.min(20, parseInt(rawItem.quantity) || 1));
      const size = sanitizeString(rawItem.size, 20) || 'По меркам';

      if (canonical) {
        calculatedTotal += canonical.unitPrice * quantity;
        validatedItems.push({
          id: canonical.id,
          name: canonical.name,
          type: canonical.type,
          price: canonical.unitPrice,
          priceText: canonical.priceText,
          size,
          quantity,
          image: canonical.image,
        });
      } else {
        // Fallback for custom or accessory items
        validatedItems.push({
          id: sanitizeString(rawItem.id, 50),
          name: sanitizeString(rawItem.name, 100) || 'Изделие KUZEL',
          type: sanitizeString(rawItem.type, 50) || 'Одежда',
          price: 0,
          priceText: 'По запросу',
          size,
          quantity,
          image: sanitizeString(rawItem.image, 150) || '',
        });
      }
    }

    const totalFormatted = calculatedTotal > 0
      ? `${calculatedTotal.toLocaleString('ru-RU')} ₽`
      : 'Цена по запросу (уточняется у менеджера)';

    // Save order securely in database
    const savedOrder = await saveOrder({
      customerName: sanitizedName,
      phone: phone.trim(),
      city: sanitizedCity,
      address: sanitizedAddress,
      deliveryMethod: sanitizedDelivery || 'Курьер / СДЭК',
      paymentMethod: sanitizedPayment || 'При получении / картой',
      comment: sanitizedComment,
      items: validatedItems,
      totalAmount: calculatedTotal,
      totalFormatted,
      ip: req.ip || '',
    });

    // Attempt to broadcast notification to Telegram admins
    let telegramResult = { success: false, deliveredCount: 0, errors: [] };
    try {
      const messageText = formatOrderMessage(savedOrder);
      telegramResult = await broadcastToAdmins(messageText);
      await updateOrderNotification(savedOrder.id, {
        sent: telegramResult.success,
        error: telegramResult.errors.join('; '),
      });
    } catch (tgErr) {
      console.error('[Telegram] Failed to notify admins:', tgErr.message);
      await updateOrderNotification(savedOrder.id, {
        sent: false,
        error: tgErr.message,
      });
    }

    return res.status(201).json({
      success: true,
      orderNumber: savedOrder.orderNumber,
      orderId: savedOrder.id,
      message: 'Спасибо за заказ! Мы получили вашу заявку и скоро свяжемся с вами.',
      telegramNotificationDelivered: telegramResult.success,
    });
  } catch (err) {
    console.error('[API Order Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера при создании заказа. Пожалуйста, попробуйте позже.',
    });
  }
});

// API: Customer callback / size consultation / feedback
app.post('/api/leads', rateLimitMiddleware, async (req, res) => {
  try {
    const { name, phone, message, type, productName, privacyConsent } = req.body;

    const sanitizedName = sanitizeString(name, 80);
    const sanitizedMsg = sanitizeString(message, 600);
    const sanitizedProduct = sanitizeString(productName, 100);
    const leadType = ['callback', 'consultation', 'feedback'].includes(type) ? type : 'feedback';

    if (!sanitizedName || sanitizedName.length < 2) {
      return res.status(400).json({ success: false, error: 'Пожалуйста, укажите ваше имя' });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ success: false, error: 'Пожалуйста, укажите корректный номер телефона' });
    }

    if (!privacyConsent) {
      return res.status(400).json({ success: false, error: 'Необходимо согласие на обработку данных' });
    }

    const savedLead = await saveLead({
      name: sanitizedName,
      phone: phone.trim(),
      message: sanitizedMsg,
      productName: sanitizedProduct,
      type: leadType,
      ip: req.ip || '',
    });

    let telegramResult = { success: false };
    try {
      const messageText = formatLeadMessage(savedLead);
      telegramResult = await broadcastToAdmins(messageText);
      await updateLeadNotification(savedLead.id, {
        sent: telegramResult.success,
        error: telegramResult.errors?.join('; '),
      });
    } catch (tgErr) {
      console.error('[Telegram Lead Error]:', tgErr.message);
      await updateLeadNotification(savedLead.id, {
        sent: false,
        error: tgErr.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Ваша заявка успешно отправлена! Менеджер KUZEL свяжется с вами в ближайшее время.',
      telegramNotificationDelivered: telegramResult.success,
    });
  } catch (err) {
    console.error('[API Lead Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при отправке заявки. Пожалуйста, попробуйте позже.',
    });
  }
});

// Production: Serve Vite build assets if dist directory exists
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    // Avoid capturing api routes with 404
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[KUZEL Server] Running on http://localhost:${PORT}`);
  console.log(`[Telegram Bot] Configured admins count: ${getAdminIds().length}`);
  startBotPolling();
});
