const express = require('express');
const path = require('path');
const { port, publicDir, staticDir, homeStaticDir } = require('./config');
const { saveMessage } = require('./data/contactStore');
const { renderPage } = require('./public/pages/page-template');

const app = express();
const host = process.env.HOST || '0.0.0.0';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/static', express.static(staticDir));
app.use('/home/static', express.static(homeStaticDir));
app.use(express.static(publicDir));

function renderContactPage(res, submitted = false) {
  const successBanner = submitted
    ? '<div class="success-banner">Thanks — your message has been sent.</div>'
    : '';

  renderPage(res, 'contact', { successBanner });
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
  renderContactPage(res, req.query.submitted === '1');
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Please fill in all contact fields.');
  }

  saveMessage({
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  });

  res.redirect('/contact?submitted=1');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'essenvian-node' });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, '404.html'));
});

function startServer(listenPort) {
  const server = app.listen(listenPort, host, () => {
    const address = server.address();
    console.log(`Essenvian Node server listening on http://${host}:${address.port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${listenPort} is already in use. Trying an available port instead.`);
      startServer(0);
    } else {
      throw error;
    }
  });
}

startServer(port);
