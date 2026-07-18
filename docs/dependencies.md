# Dependencies

## Production

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.7 | UI framework |
| `react-dom` | ^19.2.7 | React DOM renderer |
| `react-router-dom` | ^6.x | Client-side routing |
| `zustand` | ^5.x | State management |
| `konsta` | ^3.x | Mobile-first UI components (iOS/Material theme) |
| `tailwindcss` | ^4.x | Utility CSS framework |
| `@tailwindcss/vite` | ^4.x | Tailwind Vite plugin |
| `sql.js` | ^1.14.1 | SQLite WASM (compiled to JS) |
| `drizzle-orm` | ^0.x | Type-safe ORM for SQLite |
| `vite-plugin-pwa` | ^1.x | PWA manifest + service worker generation |

## Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ~6.0.2 | Type checking |
| `vite` | ^8.1.1 | Build tool |
| `@vitejs/plugin-react` | ^6.0.3 | React fast-refresh + compilation |
| `oxlint` | ^1.71.0 | Linter |
| `@types/react` | ^19.2.17 | React type definitions |
| `@types/react-dom` | ^19.2.3 | ReactDOM type definitions |
| `@types/node` | ^24.13.2 | Node type definitions |

## Drizzle SQLite Driver

| Package | Purpose |
|---------|---------|
| `drizzle-orm/sql-js` | Drizzle driver for `sql.js` |

```ts
import { drizzle } from 'drizzle-orm/sql-js';
import initSqlJs from 'sql.js';

const SQL = await initSqlJs();
const sqliteDb = new SQL.Database();
const db = drizzle(sqliteDb);
```

## Install Command

```bash
npm install react-router-dom zustand konsta tailwindcss @tailwindcss/vite sql.js drizzle-orm vite-plugin-pwa
npm install -D @types/react-router-dom
```

Note: `react`, `react-dom`, `typescript`, `vite`, `@vitejs/plugin-react`, `oxlint` already in `package.json`.
