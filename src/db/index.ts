import { drizzle } from 'drizzle-orm/sql-js'
import initSqlJs from 'sql.js'
import { get, set, del } from 'idb-keyval'

const DB_KEY = 'kontrakanku-db'

let db: ReturnType<typeof drizzle> | null = null
let initPromise: Promise<void> | null = null
let sqliteDb: any = null
let SQLCtor: any = null

async function loadPersistedDb(SQL: any) {
  const saved = await get<Uint8Array>(DB_KEY)
  return saved ? new SQL.Database(saved) : new SQL.Database()
}

export async function initSQLite() {
  const SQL = await initSqlJs({
    locateFile: () => '/assets/sql-wasm-browser.wasm',
  })

  sqliteDb = await loadPersistedDb(SQL)
  SQLCtor = SQL
  db = drizzle(sqliteDb)

  sqliteDb.run('PRAGMA foreign_keys=ON')
  sqliteDb.run(`CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    total_units INTEGER NOT NULL
  );`)
  sqliteDb.run(`CREATE TABLE IF NOT EXISTS tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL REFERENCES properties(id),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    rented_units INTEGER NOT NULL,
    rent_price INTEGER NOT NULL,
    entry_date TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
  );`)
  sqliteDb.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    amount INTEGER NOT NULL,
    payment_date TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    for_month TEXT NOT NULL
  );`)
  sqliteDb.run(`CREATE TABLE IF NOT EXISTS maintenances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL REFERENCES properties(id),
    title TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
  );`)
  sqliteDb.run(`CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON tenants(property_id);`)
  sqliteDb.run(`CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON payments(tenant_id);`)
  sqliteDb.run(`CREATE INDEX IF NOT EXISTS idx_payments_for_month ON payments(for_month);`)
  sqliteDb.run(`CREATE INDEX IF NOT EXISTS idx_maintenances_property_id ON maintenances(property_id);`)

  // Initial persist request (sering ditolak iOS karena bukan user gesture)
  await requestPersistentStorage()
}

export async function persistDB() {
  if (!sqliteDb) return
  const data = sqliteDb.export() as Uint8Array
  await set(DB_KEY, data)
}

export async function resetDB() {
  await del(DB_KEY)
}

export async function getDB() {
  if (!initPromise) {
    initPromise = initSQLite()
  }
  await initPromise
  return db!
}

export function isReady() {
  return db !== null
}

export function exportSQLite(): Uint8Array {
  if (!sqliteDb) throw new Error('DB not initialized')
  return sqliteDb.export() as Uint8Array
}

export async function importSQLite(data: Uint8Array) {
  if (!SQLCtor) throw new Error('DB not initialized')
  sqliteDb = new SQLCtor.Database(data)
  db = drizzle(sqliteDb)
  await persistDB()
}

/**
 * Request persistent storage. Panggil dari user gesture (tap/click)
 * agar iOS lebih mungkin grant.
 */
export async function requestPersistentStorage() {
  if (typeof navigator !== 'undefined' && 'storage' in navigator && 'persist' in navigator.storage) {
    try {
      const persisted = await navigator.storage.persist()
      if (!persisted) {
        console.warn('Storage persist denied — data mungkin dievict iOS dlm 7 hari.')
      }
      return persisted
    } catch { /* not supported */ }
  }
  return false
}

// Migrate legacy localStorage data → IndexedDB
;(async () => {
  const lsData = localStorage.getItem(DB_KEY)
  if (lsData) {
    try {
      const arr = JSON.parse(lsData)
      if (Array.isArray(arr)) {
        await set(DB_KEY, new Uint8Array(arr))
        localStorage.removeItem(DB_KEY)
      }
    } catch { /* ignore malformed */ }
  }
})()
