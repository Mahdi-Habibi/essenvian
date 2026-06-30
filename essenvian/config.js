const path = require('path');

const rootDir = __dirname;

module.exports = {
  port: Number(process.env.PORT) || 4000,
  rootDir,
  publicDir: path.join(rootDir, 'public'),
  staticDir: path.join(rootDir, 'static'),
  homeStaticDir: path.join(rootDir, 'home', 'static'),
  templateFilePath: path.join(rootDir, 'public', 'templates', 'page.html'),
  pagesDir: path.join(rootDir, 'public', 'pages'),
  dataDir: path.join(rootDir, 'data'),
  dataFilePath: path.join(rootDir, 'data', 'contact-messages.json'),
};
