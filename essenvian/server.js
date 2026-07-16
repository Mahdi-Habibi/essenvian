const express = require('express');
const path = require('path');
const { port, publicDir, staticDir, homeStaticDir } = require('./config');
const { saveMessage, validateMessage } = require('./data/contactStore');
const { renderPage, escapeHtml } = require('./public/pages/page-template');

const app = express();

const contactAttempts = new Map();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 8;

app.use(express.urlencoded({ extended: true, limit: '32kb' }));
app.use(express.json({ limit: '32kb' }));

app.use('/static', express.static(staticDir, { maxAge: '7d' }));
app.use('/home/static', express.static(homeStaticDir, { maxAge: '7d' }));
app.use(express.static(publicDir));

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = contactAttempts.get(ip) || { count: 0, start: now };

  if (now - entry.start > RATE_WINDOW_MS) {
    contactAttempts.set(ip, { count: 1, start: now });
    return false;
  }

  entry.count += 1;
  contactAttempts.set(ip, entry);
  return entry.count > RATE_LIMIT;
}

function renderContactPage(res, options = {}) {
  const successBanner = options.submitted
    ? '<div class="success-banner" role="status">Thank you. Your enquiry has been received. Our team will respond within two business days.</div>'
    : '';
  const errorBanner = options.error
    ? `<div class="error-banner" role="alert">${escapeHtml(options.error)}</div>`
    : '';

  renderPage(res, 'contact', { successBanner, errorBanner });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/applications', (req, res) => {
  res.sendFile(path.join(publicDir, 'applications.html'));
});

app.get('/innovation', (req, res) => {
  res.sendFile(path.join(publicDir, 'innovation.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(publicDir, 'about.html'));
});

app.get('/contact', (req, res) => {
  renderContactPage(res, { submitted: req.query.submitted === '1' });
});

app.post('/contact', (req, res) => {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return renderContactPage(res.status(429), {
      error: 'Too many submissions from this network. Please try again later.',
    });
  }

  const result = validateMessage(req.body || {});

  if (!result.ok) {
    return renderContactPage(res.status(400), { error: result.error });
  }

  saveMessage({
    ...result.data,
    createdAt: new Date().toISOString(),
    ip,
  });

  res.redirect(303, '/contact?submitted=1');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'essenvian-node' });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, '404.html'));
});

// iisnode assigns PORT (often a Windows named pipe). Do not coerce it to a number
// or bind a host — that breaks IIS deployment.
const listenPort = process.env.PORT || port;

app.listen(listenPort, () => {
  console.log('Server started');
});
