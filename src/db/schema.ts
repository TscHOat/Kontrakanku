import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core'

export const properties = sqliteTable('properties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  location: text('location').notNull(),
  totalUnits: integer('total_units').notNull(),
})

export const tenants = sqliteTable('tenants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  rentedUnits: integer('rented_units').notNull(),
  rentPrice: integer('rent_price').notNull(),
  entryDate: text('entry_date').notNull(),       // YYYY-MM-DD
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
}, (table) => [index('idx_tenants_property_id').on(table.propertyId)])

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  amount: integer('amount').notNull(),
  paymentDate: text('payment_date').notNull(),    // YYYY-MM-DD
  paymentMethod: text('payment_method').notNull(),
  forMonth: text('for_month').notNull(),          // YYYY-MM
}, (table) => [index('idx_payments_tenant_id').on(table.tenantId), index('idx_payments_for_month').on(table.forMonth)])

export const maintenances = sqliteTable('maintenances', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  title: text('title').notNull(),
  description: text('description'),
  cost: integer('cost').notNull(),
  date: text('date').notNull(),                   // YYYY-MM-DD
  status: text('status').notNull().default('pending'),
}, (table) => [index('idx_maintenances_property_id').on(table.propertyId)])
