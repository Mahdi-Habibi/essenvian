# Essenvian

A professional marketing website for Essenvian, a fragrance and sensory design studio. Built with Node.js and Express.

## Features

- Responsive home, applications, innovation, about, and contact pages
- Formal brand presentation with curated category imagery
- Contact form with validation, sanitisation, and basic rate limiting
- Messages stored as JSON in the local `data` directory
- Health check at `/health`

## Run locally

```bash
npm install
npm start
```

The application is available at [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` if you need local overrides:

- `PORT` — defaults to `3000` (on IIS/iisnode this is set automatically; do not override it)
- `HOST` — not used; the server listens on the port/pipe assigned by the host

## IIS / iisnode deployment

- Deploy the app folder with `web.config`, `server.js`, `node_modules`, and the `data/` directory.
- Ensure the IIS app pool identity has **write permission** on the `data/` folder (contact form storage).
- `server.js` must call `app.listen(process.env.PORT)` without binding a host — iisnode passes a named pipe as `PORT`.
- Set `devErrorsEnabled="false"` in `web.config` for production (already configured).
- If you need debug output temporarily, set `devErrorsEnabled="true"` in `web.config` and check the iisnode log folder under your site directory.

## Production notes

- Set `PORT` in the hosting platform.
- Ensure the process can write to `data/` for contact message persistence.
- Run with `npm start`.
