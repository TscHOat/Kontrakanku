# `tenants` — Penyewa

Tenant renting units in a property. All monetary values in IDR (integer, no decimal).

## Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, auto-increment | Unique identifier |
| `property_id` | integer | FK → `properties.id`, NOT NULL | Kontrakan tempat penyewa |
| `name` | text | NOT NULL | Nama penyewa |
| `phone` | text | nullable | Nomor telepon |
| `rented_units` | integer | NOT NULL, ≥ 1 | Jumlah unit yang disewa |
| `rent_price` | integer | NOT NULL, > 0 | Total harga sewa gabungan (seluruh unit) |
| `entry_date` | text | NOT NULL, format YYYY-MM-DD | Tanggal masuk, penentu jatuh tempo bulanan |
| `is_active` | integer | NOT NULL, default 1 (true) | Status sewa aktif |

## Indexes

| Column | Index Name | Reason |
|--------|------------|--------|
| `property_id` | `idx_tenants_property` | Filter by property |
| `is_active` | `idx_tenants_active` | Filter active tenants |

## Constraints & Validation

- `rented_units` must be ≥ 1.
- `rented_units` must not exceed available units at creation time.
- `rent_price` must be > 0.
- `entry_date` must be a valid date ≤ today.

## Derived / Computed

**Due date for current month:**

```
due_day = DAY(entry_date)
IF due_day > last_day_of_current_month
  THEN due_day = last_day_of_current_month
  ELSE due_day
```

**Payment status** (computed per tenant per month):

```
IF EXISTS payment WHERE tenant_id = t.id AND for_month = CURRENT_YYYY-MM
  THEN 'paid'
  ELSE IF today > due_date_of_current_month
    THEN 'overdue'
    ELSE 'pending'
```

## Queries

### Active tenants with payment status for current month

```sql
SELECT
  t.*,
  CASE WHEN p.id IS NOT NULL THEN 'paid'
       WHEN date('now') > date(t.entry_date, 'start of month', '+' || (CAST(strftime('%d', t.entry_date) AS INTEGER) - 1) || ' days')
       THEN 'overdue'
       ELSE 'pending'
  END AS payment_status
FROM tenants t
LEFT JOIN payments p ON p.tenant_id = t.id AND p.for_month = strftime('%Y-%m', 'now')
WHERE t.is_active = 1
ORDER BY t.entry_date DESC;
```

### Available units check (before add/edit)

```sql
SELECT p.total_units - COALESCE(SUM(t.rented_units), 0) AS available
FROM properties p
LEFT JOIN tenants t ON t.property_id = p.id AND t.is_active = 1
WHERE p.id = ?;
```

## Lifecycle

| Action | Effect |
|--------|--------|
| **Create** | Set `is_active = 1`, validate unit availability |
| **Edit** | Update fields, re-validate unit availability |
| **Deactivate** | Set `is_active = 0`. Tenant hidden from active lists, payments preserved |
| **Delete** | Only if cascade from property delete. No soft-delete for individual tenant |

## Edge Cases

- **Due date fallback:** If `entry_date = 31` and current month has < 31 days, due date becomes last day of that month (e.g. 31 Jan → 28 Feb).
