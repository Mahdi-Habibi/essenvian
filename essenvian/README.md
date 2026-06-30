# Essenvian

A polished marketing website for Essenvian, converted to a Node.js/Express application while preserving the original pages, styling, and contact form flow.

## Features

- Responsive landing page and content pages
- Static assets served from the existing project structure
- Contact form that stores submissions in JSON
- Health check endpoint at /health

## Run locally

```bash
npm install
npm start
```

The app will be available at http://localhost:3000.

## Production hosting notes

- Set the PORT environment variable in the hosting platform.
- Ensure the server process runs npm start.
- The app uses a writable data directory for message persistence.
