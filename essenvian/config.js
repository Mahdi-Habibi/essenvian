const path = require('path');

const rootDir = __dirname;

module.exports = {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  rootDir,
  publicDir: path.join(rootDir, 'public'),
  staticDir: path.join(rootDir, 'static'),
  homeStaticDir: path.join(rootDir, 'home', 'static'),
  dataDir: path.join(rootDir, 'data'),
  dataFilePath: path.join(rootDir, 'data', 'contact-messages.json'),
};
