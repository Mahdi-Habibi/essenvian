const path = require('path');

const rootDir = __dirname;

// On IIS/iisnode, PORT is a named pipe path (e.g. \\.\pipe\...), not a number.
const port = process.env.PORT || 3000;

module.exports = {
  port,
  rootDir,
  publicDir: path.join(rootDir, 'public'),
  staticDir: path.join(rootDir, 'static'),
  homeStaticDir: path.join(rootDir, 'home', 'static'),
  dataDir: path.join(rootDir, 'data'),
  dataFilePath: path.join(rootDir, 'data', 'contact-messages.json'),
};
