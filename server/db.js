import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// Ensure data directory and files exist
async function initDB() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      await fs.access(ORDERS_FILE);
    } catch {
      await fs.writeFile(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }

    try {
      await fs.access(LEADS_FILE);
    } catch {
      await fs.writeFile(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[DB] Initialization error:', err.message);
  }
}

// Simple mutex queue to prevent race conditions during concurrent file writes
let writeQueue = Promise.resolve();
function queueOperation(fn) {
  const next = writeQueue.then(fn, fn);
  writeQueue = next;
  return next;
}

export async function getOrders() {
  await initDB();
  try {
    const raw = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveOrder(orderData) {
  return queueOperation(async () => {
    await initDB();
    const orders = await getOrders();

    // Generate consecutive human-readable order number e.g. 1024
    const lastNumber = orders.length > 0 ? (orders[orders.length - 1].orderNumber || 1000) : 1000;
    const orderNumber = Number(lastNumber) + 1;

    const newOrder = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      ...orderData,
      telegramNotification: {
        sent: false,
        attempts: 0,
        lastAttempt: null,
        error: null,
      },
    };

    orders.push(newOrder);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return newOrder;
  });
}

export async function updateOrderNotification(orderId, { sent, error }) {
  return queueOperation(async () => {
    await initDB();
    const orders = await getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.telegramNotification = {
        sent: Boolean(sent),
        attempts: (order.telegramNotification?.attempts || 0) + 1,
        lastAttempt: new Date().toISOString(),
        error: error || null,
      };
      await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    }
    return order;
  });
}

export async function saveLead(leadData) {
  return queueOperation(async () => {
    await initDB();
    let leads = [];
    try {
      const raw = await fs.readFile(LEADS_FILE, 'utf-8');
      leads = JSON.parse(raw);
    } catch {
      leads = [];
    }

    const newLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...leadData,
      telegramNotification: {
        sent: false,
        lastAttempt: null,
        error: null,
      },
    };

    leads.push(newLead);
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    return newLead;
  });
}

export async function updateLeadNotification(leadId, { sent, error }) {
  return queueOperation(async () => {
    await initDB();
    let leads = [];
    try {
      const raw = await fs.readFile(LEADS_FILE, 'utf-8');
      leads = JSON.parse(raw);
    } catch {
      return null;
    }
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      lead.telegramNotification = {
        sent: Boolean(sent),
        lastAttempt: new Date().toISOString(),
        error: error || null,
      };
      await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    }
    return lead;
  });
}
