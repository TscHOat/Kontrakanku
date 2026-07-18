import { exportSQLite, getDB } from '@/db'
import { maintenances, payments, properties, tenants } from '@/db/schema'
import type { ExportData } from '@/types'

export async function exportJSON(): Promise<ExportData> {
  const db = await getDB()
  const [props, tns, pays, mains] = await Promise.all([
    db.select().from(properties).all(),
    db.select().from(tenants).all(),
    db.select().from(payments).all(),
    db.select().from(maintenances).all(),
  ])
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    properties: props,
    tenants: tns,
    payments: pays,
    maintenances: mains,
  }
}

export function downloadFile(content: Blob | Uint8Array, filename: string) {
  const blob = content instanceof Blob ? content : new Blob([content.slice().buffer])
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export { exportSQLite }
