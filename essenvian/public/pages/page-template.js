const fs = require('fs');
const path = require('path');
const { publicDir } = require('../../config');

function renderPage(res, pageName, options = {}) {
  const pagePath = path.join(publicDir, `${pageName}.html`);

  fs.readFile(pagePath, 'utf8', (err, html) => {
    if (err) {
      res.status(500).send(`Unable to load ${pageName} page.`);
      return;
    }

    let updatedHtml = html;

    if (options.successBanner) {
      updatedHtml = updatedHtml.replace('<!-- CONTACT_SUCCESS -->', options.successBanner);
    }

    res.send(updatedHtml);
  });
}

module.exports = { renderPage };
