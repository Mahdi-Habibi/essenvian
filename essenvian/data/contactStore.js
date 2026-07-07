const fs = require('fs');
const { dataDir, dataFilePath } = require('../config');

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

module.exports = {
  ensureDataFile,
  readMessages,
  saveMessage,
};
