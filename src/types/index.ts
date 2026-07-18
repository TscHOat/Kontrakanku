import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import * as schema from '../db/schema'

export type Property = InferSelectModel<typeof schema.properties>
export type NewProperty = InferInsertModel<typeof schema.properties>

export type Tenant = InferSelectModel<typeof schema.tenants>
export type NewTenant = InferInsertModel<typeof schema.tenants>

export type Payment = InferSelectModel<typeof schema.payments>
export type NewPayment = InferInsertModel<typeof schema.payments>

export type Maintenance = InferSelectModel<typeof schema.maintenances>
export type NewMaintenance = InferInsertModel<typeof schema.maintenances>

export interface ExportData {
  exportedAt: string
  version: number
  properties: Property[]
  tenants: Tenant[]
  payments: Payment[]
  maintenances: Maintenance[]
}
