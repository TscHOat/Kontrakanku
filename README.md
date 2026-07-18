# Kontrakan PWA

Aplikasi PWA *offline-first* untuk pemilik kontrakan — kelola penyewa, tagihan sewa, unit kosong, dan perbaikan. Tampilan native mobile (iOS/Material) tanpa perlu login. Data disimpan lokal di perangkat via SQLite.

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Database:** SQLite WASM (`@sqlite.org/sqlite-wasm`) + OPFS + Drizzle ORM
- **UI:** Konsta UI (dynamic theme) + Tailwind CSS 4
- **State:** Zustand
- **Routing:** react-router-dom v6
- **PWA:** vite-plugin-pwa (autoUpdate, offline penuh)

## Prerequisites

- Node.js ≥ 20
- Chrome (Android) atau Safari (iOS) versi terbaru

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install additional packages (if not already in package.json)
npm install react-router-dom zustand konsta tailwindcss @tailwindcss/vite @sqlite.org/sqlite-wasm drizzle-orm vite-plugin-pwa

# 3. Start dev server (opens on mobile network)
npm run dev

# 4. Build for production
npm run build
```

Buka `http://localhost:5173` di browser. Untuk test di HP, pastikan device terhubung ke WiFi yang sama.

## Project Structure

```
src/
├── pages/          # Route targets
├── components/     # Reusable UI
├── stores/         # Zustand stores
├── db/             # SQLite init + Drizzle schema + migrations
├── hooks/          # Custom hooks
├── lib/            # Utilities (date, export, import)
└── types/          # TypeScript types
```

Lihat [docs/prd/PRD.md](./docs/prd/PRD.md) untuk detail fitur dan [docs/db/index.md](./docs/db/index.md) untuk skema database.

## Development Priority (per feature)

1. DB schema + SQLite init
2. Properties CRUD (page + component)
3. Tenants CRUD (per property)
4. Payments (bayar + riwayat)
5. Maintenances
6. Settings (export/import)
7. PWA polish
