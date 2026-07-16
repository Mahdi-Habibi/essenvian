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

- `PORT` — defaults to `3000`
- `HOST` — defaults to `0.0.0.0`

## Production notes

- Set `PORT` in the hosting platform.
- Ensure the process can write to `data/` for contact message persistence.
- Run with `npm start`.
