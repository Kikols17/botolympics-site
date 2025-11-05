# Bot Olympics — Minimal Multilingual Frontend

Edit content:
- Open `src/locales/en.json` and `src/locales/pt.json` to change visible text.

Run locally (dev):
- npm install
- npm run dev
- Open http://localhost:3000

Build:
- npm run build
- Preview static build: npm run preview

Docker build & run:
- docker build -t bot-olympics-site .
- docker run --rm -p 8080:80 bot-olympics-site
- Open http://localhost:8080

Notes:
- The Dockerfile does a multi-stage build (node -> nginx).
- Keep editing the JSON locale files for the simplest content management.
