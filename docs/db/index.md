# Database Schema — Kontrakan PWA

SQLite local database via Drizzle ORM. 4 tables.

## Entity Relationship

```
properties
  │
  ├──< tenants          (property_id FK)
  │       │
  │       └──< payments  (tenant_id FK)
  │
  └──< maintenances     (property_id FK)
```

## Relationships

| Table | Relation | Target | Key |
|-------|----------|--------|-----|
| `tenants` | Many-to-One | `properties` | `tenants.property_id` → `properties.id` |
| `payments` | Many-to-One | `tenants` | `payments.tenant_id` → `tenants.id` |
| `maintenances` | Many-to-One | `properties` | `maintenances.property_id` → `properties.id` |

## Conventions

- **Dates:** stored as `text` in `YYYY-MM-DD` format.
- **Month periods:** stored as `text` in `YYYY-MM` format.
- **Booleans:** stored as `integer` (0/1) — SQLite has no native boolean.
- **Timestamps:** no `created_at`/`updated_at` in v1. Data integrity via app logic.
- **Cascade delete:** when a `property` is deleted, all its `tenants`, `payments` (via tenant), and `maintenances` are deleted.

## Drizzle Type Mapping

| SQLite Type | Drizzle Type Util | Notes |
|-------------|-------------------|-------|
| `integer` PK | `sqliteTable('t', { id: integer().primaryKey({ autoIncrement: true }) })` | |
| `integer` (boolean) | `is_active: integer({ mode: 'boolean' }).notNull().default(true)` | auto-converts 0/1 to true/false |
| `text` | `text().notNull()` | dates, names, methods |
| `integer` (number) | `integer().notNull()` | counters, prices, FK |
| FK column | `property_id: integer().notNull().references(() => properties.id)` | Drizzle FK constraint |

## Foreign Key Pragma

SQLite requires FK enforcement enabled per connection. Execute once after DB init:

```ts
await db.run(sql`PRAGMA foreign_keys = ON`);
```

Without this, FK constraints are silently ignored.

## Indexes

Applied to all FK columns and frequently filtered columns:

| Table | Indexed Columns | Reason |
|-------|-----------------|--------|
| `tenants` | `property_id` | Filter tenants by property |
| `tenants` | `is_active` | Filter active/inactive |
| `payments` | `tenant_id` | Join & filter by tenant |
| `payments` | `for_month` | Filter payment period |
| `maintenances` | `property_id` | Filter by property |

Drizzle index syntax:
```ts
import { index } from 'drizzle-orm/sqlite-core';

export const payments = sqliteTable('payments', {
  // ... columns
}, (table) => ({
  tenantIdx: index('idx_payments_tenant').on(table.tenant_id),
  monthIdx: index('idx_payments_month').on(table.for_month),
}));
```

## Drizzle Relations Pattern

For type-safe joins across tables:

```ts
import { relations } from 'drizzle-orm';

export const propertiesRelations = relations(properties, ({ many }) => ({
  tenants: many(tenants),
  maintenances: many(maintenances),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  property: one(properties, { fields: [tenants.property_id], references: [properties.id] }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  tenant: one(tenants, { fields: [payments.tenant_id], references: [tenants.id] }),
}));

export const maintenancesRelations = relations(maintenances, ({ one }) => ({
  property: one(properties, { fields: [maintenances.property_id], references: [properties.id] }),
}));
```

## Files

| File | Table |
|------|-------|
| [properties.md](./properties.md) | `properties` — Kontrakan/Area |
| [tenants.md](./tenants.md) | `tenants` — Penyewa |
| [payments.md](./payments.md) | `payments` — Riwayat Pembayaran |
| [maintenances.md](./maintenances.md) | `maintenances` — Perbaikan |
