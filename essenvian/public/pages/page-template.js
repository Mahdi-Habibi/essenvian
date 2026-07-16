const fs = require('fs');
const path = require('path');
const { publicDir } = require('../../config');

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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

    if (options.errorBanner) {
      updatedHtml = updatedHtml.replace('<!-- CONTACT_ERROR -->', options.errorBanner);
    } else {
      updatedHtml = updatedHtml.replace('<!-- CONTACT_ERROR -->', '');
    }

    res.send(updatedHtml);
  });
}

module.exports = { renderPage, escapeHtml };
