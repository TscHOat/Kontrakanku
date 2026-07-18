import { getDB, persistDB, importSQLite } from '@/db'
import { properties, tenants, payments, maintenances } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { ExportData } from '@/types'

function validateExportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  if (d.version !== 1) return false
  if (!Array.isArray(d.properties)) return false
  if (!Array.isArray(d.tenants)) return false
  if (!Array.isArray(d.payments)) return false
  if (!Array.isArray(d.maintenances)) return false
  return true
}

/**
 * Import JSON: merge data, skip duplicates by checking existing rows.
 * Returns { properties, tenants, payments, maintenances } counts.
 */
export async function importJSON(data: ExportData) {
  if (!validateExportData(data)) {
    throw new Error('Format file tidak valid')
  }

  const db = await getDB()
  let propsAdded = 0, tenantsAdded = 0, paymentsAdded = 0, mainsAdded = 0

  for (const p of data.properties) {
    const existing = await db.select().from(properties).where(eq(properties.id, p.id)).get()
    if (!existing) {
      await db.insert(properties).values(p)
      propsAdded++
    }
  }

  for (const t of data.tenants) {
    const existing = await db.select().from(tenants).where(eq(tenants.id, t.id)).get()
    if (!existing) {
      await db.insert(tenants).values(t)
      tenantsAdded++
    }
  }

  for (const p of data.payments) {
    const existing = await db.select().from(payments).where(eq(payments.id, p.id)).get()
    if (!existing) {
      await db.insert(payments).values(p)
      paymentsAdded++
    }
  }

  for (const m of data.maintenances) {
    const existing = await db.select().from(maintenances).where(eq(maintenances.id, m.id)).get()
    if (!existing) {
      await db.insert(maintenances).values(m)
      mainsAdded++
    }
  }

  await persistDB()
  return { properties: propsAdded, tenants: tenantsAdded, payments: paymentsAdded, maintenances: mainsAdded }
}

export { importSQLite }

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
