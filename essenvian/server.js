const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;
const dataDir = path.join(__dirname, 'data');
const dataFilePath = path.join(dataDir, 'contact-messages.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/home/static', express.static(path.join(__dirname, 'home', 'static')));
app.use(express.static(path.join(__dirname, 'public')));

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
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

function saveMessage(message) {
  const messages = readMessages();
  messages.push(message);
  fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2), 'utf8');
}

function renderContactPage(res, submitted = false) {
  const filePath = path.join(__dirname, 'public', 'contact.html');
  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) {
      res.status(500).send('Unable to load contact page.');
      return;
    }

    const successBlock = submitted
      ? '<div class="success-banner">Thanks — your message has been sent.</div>'
      : '';

    const updatedHtml = html.replace('<!-- CONTACT_SUCCESS -->', successBlock);
    res.send(updatedHtml);
  });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/applications', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'applications.html'));
});

app.get('/innovation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'innovation.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
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
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
  console.log(`Essenvian Node server listening on port ${port}`);
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing process or choose a different PORT.`);
    process.exit(1);
  } else {
    throw error;
  }
});
