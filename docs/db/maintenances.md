# `maintenances` — Perbaikan

Records maintenance/repair events in a property. No photo attachment in v1.

## Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, auto-increment | Unique identifier |
| `property_id` | integer | FK → `properties.id`, NOT NULL | Kontrakan tempat perbaikan |
| `title` | text | NOT NULL | Judul perbaikan |
| `description` | text | nullable | Detail perbaikan (opsional, bisa sebut unit spesifik) |
| `cost` | integer | NOT NULL, ≥ 0 | Biaya perbaikan |
| `date` | text | NOT NULL, format YYYY-MM-DD | Tanggal perbaikan |
| `status` | text | NOT NULL, default 'pending' | Status: `pending` atau `completed` |

## Constraints & Validation

- `cost` must be ≥ 0 (0 allowed for minor fixes recorded for tracking).
- `date` must be a valid date ≤ today.
- `status` must be one of: `pending`, `completed`.

## Queries

### All maintenances for a property (with status filter)

```sql
SELECT * FROM maintenances
WHERE property_id = ?
  AND (? IS NULL OR status = ?)   -- optional status filter
ORDER BY date DESC;
```

### Total maintenance cost per property

```sql
SELECT
  property_id,
  COUNT(*) AS total_count,
  SUM(cost) AS total_cost,
  SUM(CASE WHEN status = 'completed' THEN cost ELSE 0 END) AS completed_cost
FROM maintenances
WHERE property_id = ?
GROUP BY property_id;
```

## Indexes

| Column | Index Name | Reason |
|--------|------------|--------|
| `property_id` | `idx_maintenances_property` | Filter by property |

## Status Transitions

```
pending ──→ completed
completed ──→ pending  (reopen allowed)
```

No other states in v1.
