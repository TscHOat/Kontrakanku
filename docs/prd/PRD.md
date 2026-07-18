# Product Requirements Document (PRD)
**Nama Aplikasi:** Kontrakan PWA
**Platform:** Mobile-first PWA (Dapat di-install di HP Android/iOS)
**Tech Stack:** React (Vite), Tailwind CSS, Konsta UI, Zustand, react-router-dom, Drizzle ORM, SQLite (WASM/OPFS)

## 1. Tujuan Produk
Membangun aplikasi PWA *offline-first* untuk membantu pemilik kontrakan mengelola data penyewa, tagihan sewa bulanan, ketersediaan unit, dan pencatatan perbaikan. Aplikasi tidak memerlukan login dan seluruh data disimpan secara lokal di perangkat pengguna menggunakan SQLite. Aplikasi dirancang khusus untuk penggunaan di HP dengan tampilan menyerupai aplikasi native.

## 2. Desain Arsitektur & Tech Stack
* **Framework:** React + Vite — performa cepat, ukuran bundle kecil.
* **Database:** SQLite via WASM (`sql.js`) — baca/tulis cepat tanpa beban UI thread.
* **ORM:** Drizzle ORM (`drizzle-orm/sqlite`) — definisi skema dan query type-safe.
* **State Management:** Zustand — state global ringan.
* **Routing:** react-router-dom — navigasi multi-halaman.
* **UI Library:** Konsta UI + Tailwind CSS — tampilan native iOS/Material Design, komponen mobile-ready (Bottom Navigation, Sheet Modal). Theme: dynamic (detect platform otomatis).
* **PWA:** `vite-plugin-pwa` — registerType `autoUpdate`, cache semua aset untuk offline penuh. Ikon PWA disiapkan manual.
* **Path Alias:** `@/` → `src/` (vite resolve alias).
* **Target Browser:** Chrome (Android) & Safari (iOS) — versi terbaru.

---

## 3. Skema Database (Drizzle ORM)

### Table: `properties` (Kontrakan/Area)
* `id` (integer, primary key, auto increment)
* `name` (text) — Nama kontrakan/area
* `location` (text) — Alamat/lokasi
* `total_units` (integer) — Total unit yang tersedia

### Table: `tenants` (Penyewa)
* `id` (integer, primary key, auto increment)
* `property_id` (integer, foreign key -> properties.id)
* `name` (text) — Nama penyewa
* `phone` (text) — Nomor telepon
* `rented_units` (integer) — Jumlah unit yang disewa (validasi: ≤ sisa unit kosong)
* `rent_price` (integer) — Total harga sewa gabungan
* `entry_date` (text, format YYYY-MM-DD) — Tanggal masuk (penentu jatuh tempo)
* `is_active` (boolean, default true) — Status sewa aktif. Jika nonaktif, data tetap tersimpan.

### Table: `payments` (Riwayat Pembayaran)
* `id` (integer, primary key, auto increment)
* `tenant_id` (integer, foreign key -> tenants.id)
* `amount` (integer) — Jumlah yang dibayarkan (1 bulan per transaksi, tidak bisa bayar sebagian)
* `payment_date` (text, format YYYY-MM-DD) — Tanggal pembayaran
* `payment_method` (text) — Metode bayar (Cash, Transfer, dll)
* `for_month` (text, format YYYY-MM) — Periode bulan yang dibayarkan
* Catatan: Mendukung edit & delete payment.

### Table: `maintenances` (Perbaikan)
* `id` (integer, primary key, auto increment)
* `property_id` (integer, foreign key -> properties.id)
* `title` (text) — Judul perbaikan (misal: "Ganti Atap Bocor")
* `description` (text) — Detail perbaikan (opsional)
* `cost` (integer) — Biaya perbaikan
* `date` (text, format YYYY-MM-DD) — Tanggal perbaikan
* `status` (text, default 'pending') — Status: `pending` / `completed`

---

## 4. Fitur Utama & Alur Pengguna

### A. Manajemen Kontrakan (Properties)
* **View List:** Daftar kontrakan (card). Setiap item: Nama, Lokasi, **Jumlah Unit Kosong**.
  * *Formula:* `properties.total_units` - SUM `tenants.rented_units` (WHERE `is_active = true`).
* **Add/Edit Kontrakan:** Form: Nama, Lokasi, Total Unit.
* **Delete Kontrakan:** Hapus kontrakan beserta seluruh penyewa, pembayaran, dan perbaikan di dalamnya (konfirmasi sebelum hapus).
* **Empty State:** Ilustrasi + CTA "Tambah Kontrakan Pertama" saat belum ada data.
* **Loading State:** Spinner/skeleton saat inisialisasi DB dan query.
* **Error State:** Notifikasi jika DB gagal load atau query error.

### B. Manajemen Penyewa (Tenants)
* **View List:** Di dalam **Detail Kontrakan**, bagian daftar penyewa aktif di area tersebut. Menampilkan Nama, Jumlah Unit, Harga Sewa, Status Bayar (Lunas/Hijau, Belum/Merah).
  * Search bar untuk filter nama penyewa dalam satu properti.
* **Add Penyewa:** Tombol "+" di Detail Kontrakan -> Form: Nama, No Telp, (Kontrakan terisi otomatis), Jml Unit, Harga Sewa, Tanggal Masuk.
  * Validasi: `rented_units` tidak boleh melebihi sisa unit kosong di properti tersebut.
* **Edit Penyewa:** Form sama seperti Add, terisi data existing.
* **Nonaktifkan Penyewa:** Tombol "Nonaktifkan" -> set `is_active = false`. Penyewa tidak muncul di list aktif, data pembayaran tetap tersimpan.
* **Detail Penyewa:** Info lengkap + **Riwayat Pembayaran** (daftar kronologis, bisa edit/hapus payment).
  * *Logika Jatuh Tempo:* Tanggal `entry_date` adalah tanggal jatuh tempo setiap bulan. Jika tanggal (misal 31) tidak ada di bulan berjalan, pakai **akhir bulan** (31 Jan -> 28 Feb -> 31 Mar). Jika hari ini melewati tanggal jatuh tempo dan belum ada payment untuk bulan tersebut, status "Belum Bayar".
* **Empty State:** Ilustrasi + CTA "Tambah Penyewa" saat belum ada penyewa aktif.

### C. Manajemen Pembayaran
* **Tombol Bayar:** Di list penyewa & detail penyewa, tombol "Tandai Sudah Bayar".
* **Confirmation Dialog (Konsta UI Sheet):**
  * Jumlah bayar (otomatis = `rent_price`, tidak bisa diubah — tidak ada bayar sebagian/sebagian).
  * Metode pembayaran (dropdown: Cash, Transfer, dll).
  * Periode bulan yang dibayarkan (default: bulan jatuh tempo saat ini).
  * 1 transaksi = 1 bulan. Tidak bisa bayar multi-bulan.
* **Edit Payment:** Tap payment di riwayat -> edit jumlah/metode/periode (jika salah input).
* **Delete Payment:** Swipe/hapus payment dari riwayat (konfirmasi).
* **Cicilan / Bayar Sebagian:** Tidak didukung di v1.

### D. Manajemen Perbaikan (Maintenance)
* **View List:** Di halaman Detail Kontrakan, tab/section "Perbaikan". Daftar perbaikan (Judul, Tanggal, Biaya, Status).
  * Filter: semua / pending / selesai.
* **Add Perbaikan:** Form: Judul, Detail (opsional), Biaya, Tanggal.
* **Edit/Delete Perbaikan:** Edit detail atau hapus perbaikan.
* **Update Status:** Tombol tandai "Selesai" / "Pending" pada item perbaikan.
* **Lampiran Foto:** Tidak didukung di v1.
* **Empty State:** Ilustrasi + CTA "Catat Perbaikan" saat belum ada data.

### E. Data Backup (Export/Import)
* **Export Data:** Tombol di halaman Pengaturan.
  * Export ke format **JSON** (mudah dibaca) dan/atau **.sqlite** (full binary backup).
  * File disimpan via download browser (bisa diakses dari folder Download HP).
* **Import Data:** Tombol unggah file backup.
  * **Merge strategy:** Data baru ditambahkan, data lama tetap (tidak ada replace).
  * Validasi format file (.json / .sqlite).
  * Notifikasi hasil import (sukses/gagal/detil konflik jika ada).
* **Keamanan:** Validasi struktur data sebelum import untuk mencegah korupsi.

### F. Non-Functional Requirements & Edge Cases
* **Inisialisasi:** Splash screen / loading awal saat SQLite WASM (sql.js) diinisialisasi.
* **Performa:** Query response target < 200ms. Optimasi index Drizzle.
* **Storage:** SQLite default page cache. Tidak ada pagar hard limit v1, pantau penggunaan.
* **Browser Support:** Chrome (Android) & Safari (iOS) versi terbaru.
* **Dark Mode:** Tidak didukung di v1. Light mode only.
* **Bundle Size:** Prioritaskan code splitting per halaman (react-router lazy load).

---

## 5. Route Structure (react-router-dom v6+)

### 5.1 Route Table

| Path | Halaman | Type | Bottom Nav Tab |
|------|---------|------|----------------|
| `/` | PropertiesPage — Daftar kontrakan | Tab | Kontrakan |
| `/property/new` | PropertyFormPage — Tambah kontrakan | Push | — |
| `/property/:id` | PropertyDetailPage — Detail kontrakan + penyewa + perbaikan | Push | — |
| `/property/:id/edit` | PropertyFormPage (mode edit) — Edit kontrakan | Push | — |
| `/property/:id/tenant/new` | TenantFormPage — Tambah penyewa (di properti ini) | Push | — |
| `/tenant/:id` | TenantDetailPage — Detail penyewa + riwayat payment | Push | — |
| `/tenant/:id/edit` | TenantFormPage (mode edit) — Edit penyewa | Push | — |
| `/settings` | SettingsPage — Export, Import, info versi | Tab | Pengaturan |

### 5.2 Route Nesting & Layout

```
<App>
  <KonstaApp>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>          ← Navbar + BottomNav wrapper
          <Route index element={<PropertiesPage />} />
          <Route path="property/new" element={<PropertyFormPage />} />
          <Route path="property/:id" element={<PropertyDetailPage />} />
          <Route path="property/:id/edit" element={<PropertyFormPage />} />
          <Route path="property/:id/tenant/new" element={<TenantFormPage />} />
          <Route path="tenant/:id" element={<TenantDetailPage />} />
          <Route path="tenant/:id/edit" element={<TenantFormPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <LoadingScreen />   ← overlay, muncul saat init DB
  </KonstaApp>
</App>
```

### 5.3 Loading Screen
* Tampil saat SQLite WASM (sql.js) + SW registration belum selesai.
* Setelah siap, fade out -> route aktif.

### 5.4 Page Transitions
* v1: instant switch (no animation). Evaluasi framer-motion di fase berikutnya bila perlu.

---

## 6. Folder Structure

```
src/
├── main.tsx                     # Entry point: init DB, render App
├── App.tsx                      # BrowserRouter + Routes + Konsta App wrapper
├── index.css                    # Tailwind directives, global styles
├── vite-env.d.ts
│
├── db/
│   ├── index.ts                 # SQLite init (sql.js), export db instance
│   ├── schema.ts                # Drizzle schema — all tables
│   └── migrations/              # Manual migration scripts (future)
│
├── stores/
│   ├── useProperties.ts         # Zustand store — properties CRUD + query
│   ├── useTenants.ts            # Zustand store — tenants CRUD + search
│   ├── usePayments.ts           # Zustand store — payments CRUD + riwayat
│   └── useMaintenances.ts       # Zustand store — maintenances CRUD
│
├── pages/
│   ├── LoadingScreen.tsx        # Initial loading overlay (DB init)
│   ├── PropertiesPage.tsx       # / — list kontrakan
│   ├── PropertyFormPage.tsx     # /property/new, /property/:id/edit
│   ├── PropertyDetailPage.tsx   # /property/:id — detail + penyewa + perbaikan
│   ├── TenantFormPage.tsx       # /property/:id/tenant/new, /tenant/:id/edit
│   ├── TenantDetailPage.tsx     # /tenant/:id — detail + riwayat payment
│   └── SettingsPage.tsx         # /settings — export, import, info
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx        # Navbar + BottomTabBar + <Outlet />
│   │   └── BottomTabBar.tsx     # Konsta Tabbar — 2 tab (Kontrakan, Pengaturan)
│   ├── properties/
│   │   ├── PropertyCard.tsx     # Card item kontrakan
│   │   └── PropertyForm.tsx     # Form tambah/edit kontrakan
│   ├── tenants/
│   │   ├── TenantCard.tsx       # Card item penyewa + indikator status
│   │   ├── TenantForm.tsx       # Form tambah/edit penyewa
│   │   └── PaymentHistory.tsx   # Riwayat pembayaran (list + edit/delete)
│   ├── payments/
│   │   └── PaymentSheet.tsx     # Bottom sheet bayar (Konsta Sheet)
│   ├── maintenances/
│   │   ├── MaintenanceList.tsx  # Daftar perbaikan + filter status
│   │   └── MaintenanceForm.tsx  # Form tambah/edit perbaikan
│   └── ui/
│       ├── EmptyState.tsx       # Ilustrasi + CTA reusable
│       ├── ErrorNotice.tsx      # Error banner reusable
│       └── ConfirmDialog.tsx    # Konfirmasi hapus/nonaktifkan reusable
│
├── hooks/
│   ├── useDB.ts                 # Hook akses db instance
│   └── usePaymentStatus.ts      # Hook logika jatuh tempo + status bayar
│
├── lib/
│   ├── date.ts                  # Helper tanggal: nextDueDate, dueDateFallback, format
│   └── export.ts                # Fungsi export JSON / .sqlite
│   └── import.ts                # Fungsi import + validasi merge
│
└── types/
    └── index.ts                 # TypeScript types (infer dari Drizzle schema)
```

### 6.1 Key Design Rules
* **Page vs Component:** Page = route target, fetching data. Component = reusable UI, receives props.
* **Store per entity:** Masing-masing store handle query DB via Drizzle + expose actions. Avoid store coupling (cross-entity query di page level).
* **No barrel index.ts** di folder — import path langsung ke file spesifik.

---

## 7. Panduan Teknis Implementasi

1. **Routing:** Sesuai route table section 5. `react-router-dom` v6+ dengan lazy loading per halaman (React.lazy + Suspense).
2. **State Management:** Zustand store untuk global state (active route, data cache, UI state). Query DB langsung via Drizzle di store actions.
3. **Inisialisasi SQLite:**
   * Init SQLite WASM + OPFS di entry point. Tampilkan loading screen sampai siap.
4. **Drizzle Schema:**
   * Tipe `text` untuk tanggal/format YYYY-MM-DD/YYYY-MM.
   * Gunakan index untuk kolom yang sering difilter (`tenant_id`, `property_id`, `for_month`).
5. **PWA Setup:**
   * `vite-plugin-pwa` dengan `registerType: 'autoUpdate'` — update SW otomatis tanpa prompt.
   * Cache semua aset Vite (JS, CSS, font, favicon) untuk offline penuh.
6. **Migrasi Database:**
   * Schema berubah di update berikutnya -> buat **script migrasi manual** Drizzle (bukan drop & recreate).
7. **Konsta UI Integration:**
   * Bungkus dengan `App` component Konsta UI (theme: iOS).
   * `Tabbar` + `TabbarLink` untuk bottom navigation.
   * `Sheet` / `Dialog` untuk konfirmasi pembayaran.
   * `List`, `ListItem`, `Navbar`, `Button`, `Input` untuk komponen UI standar.
8. **Testing:** (v1 — manual. Framework test: pertimbangkan Vitest + Testing Library untuk fase berikutnya.)