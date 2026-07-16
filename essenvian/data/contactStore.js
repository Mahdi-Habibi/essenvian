const fs = require('fs');
const { dataDir, dataFilePath } = require('../config');

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_COMPANY = 160;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]', 'utf8');
  }
}

function readMessages() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sanitize(value, max) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

function validateMessage({ name, email, company, message }) {
  const clean = {
    name: sanitize(name, MAX_NAME),
    email: sanitize(email, MAX_EMAIL).toLowerCase(),
    company: sanitize(company, MAX_COMPANY),
    message: sanitize(message, MAX_MESSAGE),
  };

  if (!clean.name || !clean.email || !clean.message) {
    return { ok: false, error: 'Please complete all required fields.' };
  }

  if (!EMAIL_RE.test(clean.email)) {
    return { ok: false, error: 'Please provide a valid email address.' };
  }

  if (clean.message.length < 10) {
    return { ok: false, error: 'Please provide a more detailed message.' };
  }

  return { ok: true, data: clean };
}

function saveMessage(message) {
  const messages = readMessages();
  messages.push({
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: message.createdAt || new Date().toISOString(),
  });
  fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2), 'utf8');
}

module.exports = {
  ensureDataFile,
  readMessages,
  saveMessage,
  validateMessage,
};
