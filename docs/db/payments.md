# `payments` — Riwayat Pembayaran

Records individual monthly rent payments. One transaction = one month. No partial payments.

## Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, auto-increment | Unique identifier |
| `tenant_id` | integer | FK → `tenants.id`, NOT NULL | Penyewa yang bayar |
| `amount` | integer | NOT NULL, > 0 | Jumlah dibayarkan |
| `payment_date` | text | NOT NULL, format YYYY-MM-DD | Tanggal pembayaran dilakukan |
| `payment_method` | text | NOT NULL | Metode bayar (Cash, Transfer, dll) |
| `for_month` | text | NOT NULL, format YYYY-MM | Periode bulan yang dibayarkan |

## Constraints & Validation

- `amount` must equal `tenants.rent_price` at time of payment (no partial, no overpayment).
- `for_month` must be a valid YYYY-MM and not in the future (cannot pre-pay beyond current month).
- `for_month` combination with `tenant_id` must be unique (duplicate check).
- `payment_date` must be a valid date ≤ today.

## Business Rules

- 1 transaction = 1 month. Multi-month payment not allowed.
- Edit allowed: amount, payment_method, for_month, payment_date.
- Delete allowed: removes record. Payment status reverts to unpaid for that month.

## Queries

### All payments for a tenant (chronological)

```sql
SELECT * FROM payments
WHERE tenant_id = ?
ORDER BY for_month DESC, payment_date DESC;
```

### Payment status for all months since entry

```sql
WITH RECURSIVE months AS (
  SELECT strftime('%Y-%m', entry_date) AS month_start
  FROM tenants WHERE id = ?
  UNION ALL
  SELECT strftime('%Y-%m', date(month_start || '-01', '+1 month'))
  FROM months
  WHERE month_start <= strftime('%Y-%m', 'now')
)
SELECT
  m.month_start,
  CASE WHEN p.id IS NOT NULL THEN 'paid' ELSE 'unpaid' END AS status,
  p.amount,
  p.payment_method,
  p.payment_date
FROM months m
LEFT JOIN payments p ON p.tenant_id = ? AND p.for_month = m.month_start
ORDER BY m.month_start DESC;
```

## Indexes

| Column | Index Name | Reason |
|--------|------------|--------|
| `tenant_id` | `idx_payments_tenant` | Join & filter by tenant |
| `for_month` | `idx_payments_month` | Filter payment period |

## Unique Constraint

Compound unique on `(tenant_id, for_month)` — prevents duplicate payment for same month.

Drizzle:
```ts
uniqueIndex('uq_payments_tenant_month').on(table.tenant_id, table.for_month)
```

## Payment Methods (recommended options)

| Value | Label |
|-------|-------|
| `cash` | Cash |
| `transfer` | Transfer Bank |
| `e-wallet` | E-Wallet (GoPay, OVO, Dana, dll) |

Store as lowercase string. Extensible — user can input custom method.
