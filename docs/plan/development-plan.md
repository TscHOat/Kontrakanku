# Development Plan — Kontrakan PWA

**Status:** Boilerplate Vite (React + TS), belum ada kode aplikasi.
**Acuan:** PRD di `docs/prd/PRD.md`
**Urutan:** Berdasarkan userflow — Properties → Tenants → Payments → Maintenance → Settings → PWA.

---

## Fase 0 — Inisialisasi Project & Dependencies

### 0.1 Install dependencies
| Package | Notes |
|---------|-------|
| `tailwindcss`, `@tailwindcss/vite` | Utility CSS |
| `konsta` | Konsta UI (iOS/Material) |
| `react-router-dom` | Routing |
| `zustand` | State management |
| `drizzle-orm`, `drizzle-kit` | ORM + schema push |
| `sql.js` | SQLite via WASM |
| `vite-plugin-pwa` | PWA manifest + SW |
| `@types/react-router-dom` | (maybe built-in now) |

### 0.2 Konfigurasi
- Tailwind: `tailwind.config.js`, tambahkan `@tailwindcss/vite` di Vite plugin.
- Path alias `@/` → `src/` di Vite & tsconfig.
- Pastikan `vite.config.ts` punya resolve alias.

### 0.3 Hapus boilerplate
- Bersihkan `App.tsx`, `App.css`, `index.css`.
- Hapus aset Vite/React (logo, hero, dll).

---

## Fase 1 — Database Foundation

### 1.1 SQLite WASM (sql.js) initialization
- `src/db/index.ts` — Init SQLite (sql.js), simpan db instance.
- `src/db/schema.ts` — Drizzle schema: `properties`, `tenants`, `payments`, `maintenances`.
- Index di: `tenants.property_id`, `payments.tenant_id`, `payments.for_month`, `maintenances.property_id`.

### 1.2 Loading screen
- `src/pages/LoadingScreen.tsx` — Overlay inisialisasi DB.
- Integrasi di `main.tsx`: render LoadingScreen sampai DB ready.

### 1.3 Zustand stores (shell)
- `src/stores/useProperties.ts` — skeleton.
- `src/stores/useTenants.ts` — skeleton.
- `src/stores/usePayments.ts` — skeleton.
- `src/stores/useMaintenances.ts` — skeleton.
- Isi dengan fungsi CRUD tiap fase.

### 1.4 Types
- `src/types/index.ts` — Infer type dari Drizzle schema.

---

## Fase 2 — UI Shell & Routing

### 2.1 Layout
- `src/components/layout/AppLayout.tsx` — Navbar + Bottom Tab Bar + `<Outlet />`.
- `src/components/layout/BottomTabBar.tsx` — 2 tab: Kontrakan, Pengaturan.

### 2.2 Router setup
- `src/App.tsx` — `BrowserRouter`, `Routes`, `React.lazy` + `Suspense` untuk tiap page.
- Route table sesuai PRD section 5.

### 2.3 UI components reusable (shell)
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/ErrorNotice.tsx`
- `src/components/ui/ConfirmDialog.tsx`
- `src/hooks/useDB.ts` — hook akses db.
- `src/hooks/usePaymentStatus.ts` — hook logika jatuh tempo (skeleton dulu).

### 2.4 Date helpers
- `src/lib/date.ts` — `nextDueDate()`, `dueDateFallback()`, format helpers.

---

## Fase 3 — Properties (Kontrakan) CRUD

### 3.1 PropertiesPage (`/`)
- List kontrakan dari DB via `useProperties`.
- Card: Nama, Lokasi, **Jumlah Unit Kosong** (`total_units - SUM rented_units`).
- Empty state + CTA "Tambah Kontrakan Pertama".
- Loading state (skeleton/spinner).
- Error state.
- Tombol "+" FAB untuk tambah kontrakan.

### 3.2 PropertyFormPage (`/property/new`, `/property/:id/edit`)
- Form: Nama, Lokasi, Total Unit.
- Mode create vs edit.

### 3.3 Delete property
- Konfirmasi hapus (ConfirmDialog).
- Cascade hapus: tenants + payments + maintenances di properti tsb.

### 3.4 Components
- `src/components/properties/PropertyCard.tsx`
- `src/components/properties/PropertyForm.tsx`

---

## Fase 4 — Tenants (Penyewa) CRUD

### 4.1 Tenant list di PropertyDetailPage
- `src/pages/PropertyDetailPage.tsx` — Detail kontrakan + daftar penyewa aktif.
- Search bar filter nama penyewa.
- Tiap item: Nama, Jml Unit, Harga Sewa, Status Bayar (Lunas/Merah).
- Tab/section "Perbaikan" (skeleton, isi di Fase 6).
- Tombol "+" tambah penyewa.

### 4.2 TenantFormPage (`/property/:id/tenant/new`, `/tenant/:id/edit`)
- Form: Nama, No Telp, Jml Unit, Harga Sewa, Tanggal Masuk.
- Validasi: `rented_units` ≤ sisa unit kosong.

### 4.3 TenantDetailPage (`/tenant/:id`)
- Info lengkap penyewa.
- Riwayat pembayaran (integrasi Fase 5).
- Tombol "Tandai Sudah Bayar" (integrasi Fase 5).
- Tombol "Nonaktifkan" → `is_active = false`.

### 4.4 Components
- `src/components/tenants/TenantCard.tsx`
- `src/components/tenants/TenantForm.tsx`
- `src/components/tenants/PaymentHistory.tsx`

---

## Fase 5 — Payments (Pembayaran)

### 5.1 PaymentSheet
- `src/components/payments/PaymentSheet.tsx` — Bottom sheet bayar (Konsta Sheet).
- Jumlah bayar = `rent_price` (otomatis, tidak bisa diubah).
- Metode bayar (dropdown: Cash, Transfer, dll).
- Periode bulan (default: bulan jatuh tempo saat ini).
- Validasi: 1 transaksi = 1 bulan.

### 5.2 Riwayat pembayaran
- List kronologis di TenantDetailPage.
- Edit payment: tap → edit jumlah/metode/periode.
- Delete payment: konfirmasi hapus.
- Status bayar: hijau (lunas) / merah (belum) berdasar logika jatuh tempo.

### 5.3 Payment status logic
- `src/hooks/usePaymentStatus.ts` — isi penuh.
- `src/lib/date.ts` — `nextDueDate()`, `dueDateFallback()`.

---

## Fase 6 — Maintenances (Perbaikan)

### 6.1 Maintenance list di PropertyDetailPage
- Tab/section "Perbaikan". Filter: semua / pending / selesai.
- Tiap item: Judul, Tanggal, Biaya, Status.
- Tombol "Selesai" / "Pending" toggle.

### 6.2 MaintenanceForm
- `src/components/maintenances/MaintenanceForm.tsx`
- Form: Judul, Detail (opsional), Biaya, Tanggal.
- Edit/delete.

---

## Fase 7 — Settings & Data Backup

### 7.1 SettingsPage (`/settings`)
- Tombol Export JSON.
- Tombol Export .sqlite.
- Tombol Import (upload file JSON/.sqlite).
- Merge strategy: tambah data baru, data lama tetap.
- Validasi struktur data sebelum import.
- Notifikasi hasil.

### 7.2 Export/import lib
- `src/lib/export.ts` — export to JSON / .sqlite.
- `src/lib/import.ts` — import + validasi + merge.

---

## Fase 8 — PWA Setup

### 8.1 vite-plugin-pwa
- Register SW dengan `registerType: 'autoUpdate'`.
- Cache semua aset Vite untuk offline penuh.
- Ikon PWA (disiapkan manual).

### 8.2 Manifest
- Nama, theme color, start_url, display: standalone.
- Ikon: 192x192, 512x512.

### 8.3 HTML meta
- Update `index.html`: theme-color, apple-mobile-web-app-capable, dll.

---

## Fase 9 — Polish & Final Testing

### 9.1 Edge cases
- Tanggal jatuh tempo fallback (31 Jan → 28 Feb → 31 Mar).
- Validasi form di semua CRUD.
- Empty states semua halaman.
- Error handling DB.

### 9.2 QA manual
- Test flow lengkap di browser.
- Test install PWA.
- Test export/import roundtrip.

### 9.3 Bundle size
- Code splitting sudah via React.lazy (Fase 2).
- Cek bundle size build.

---

## Catatan Teknis

- **No barrel index.ts** — import path langsung ke file spesifik.
- **Store per entity** — masing-masing store handle query DB via Drizzle.
- **Konsta UI** — bungkus dengan `<App>` component (theme: iOS).
- **Path alias** — `@/` → `src/`.
- **Light mode only** — dark mode tidak didukung di v1.
- **Page transitions** — instant switch, no animation (framer-motion ditunda).
