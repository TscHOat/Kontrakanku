# `properties` — Kontrakan / Area

Parent entity. A property is a boarding house area/compound with multiple units.

## Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, auto-increment | Unique identifier |
| `name` | text | NOT NULL | Nama kontrakan/area |
| `location` | text | NOT NULL | Alamat/lokasi |
| `total_units` | integer | NOT NULL, > 0 | Total unit tersedia |

## Constraints & Validation

- `total_units` must be ≥ 1.
- `total_units` cannot be reduced below currently rented units (sum of `tenants.rented_units` where `is_active = true`).

## Derived / Computed

**Available units** (not stored, computed at query time):

```
available_units = total_units - SUM(tenants.rented_units)
                  WHERE tenants.is_active = true
                  AND tenants.property_id = properties.id
```

## Queries

### List all properties with available units

```sql
SELECT
  p.*,
  p.total_units - COALESCE(SUM(t.rented_units), 0) AS available_units
FROM properties p
LEFT JOIN tenants t ON t.property_id = p.id AND t.is_active = 1
GROUP BY p.id
ORDER BY p.name;
```

### Delete cascade

Deleting a property cascades to:
- All `tenants` with `property_id = p.id` → cascades to their `payments`.
- All `maintenances` with `property_id = p.id`.

## Indexes

| Column | Index Name | Reason |
|--------|------------|--------|
| `id` | PK (auto-indexed) | Primary key lookup |
