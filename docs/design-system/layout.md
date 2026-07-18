# Layout & Spacing

> Struktur halaman, grid, dan safe area untuk Kontrakan PWA. Mobile-first, single column. Mengacu pada layout yang sudah ada di Open Design prototype (folder `screens/`).

---

## 1. Page Anatomy — React (Implementasi)

Setiap halaman React mengikuti struktur ini:

```
┌──────────────────────────────┐
│         Navbar (sticky)      │  ← bg-white (default Konsta)
│                              │     height: ~44px (Konsta default)
├──────────────────────────────┤
│                              │
│     Page Content             │  ← bg-gray-50 / var(--bg)
│     (scrollable)             │     pb-16 (hindari bottom tab)
│                              │
│   ┌──────────────────────┐   │
│   │   Card / Section     │   │  ← mx-4, mb-3
│   └──────────────────────┘   │
│                              │
│   ┌──────────────────────┐   │
│   │   Card / Section     │   │
│   └──────────────────────┘   │
│                              │
├──────────────────────────────┤
│   BottomTabBar (conditional) │  ← safe-area-bottom
└──────────────────────────────┘
```

Kode:
```tsx
<div className="min-h-screen bg-gray-50 pb-safe">
  <Navbar title="..." className="sticky top-0 z-40" />
  <main className="pb-16">
    {/* content */}
  </main>
  {showTabs && <BottomTabBar />}
</div>
```

---

## 2. Page Anatomy — Prototype (Open Design)

Setiap screen HTML prototype mengikuti struktur ini:

```
┌──────────────────────────────┐
│         Status Bar           │  ← height: 20px, var(--surface)
│      09:41  📶 🔋            │
├──────────────────────────────┤
│         Navbar               │  ← height: 44px, var(--surface)
│  ← Kembali    Judul    Aksi  │     0.5px separator bottom
├──────────────────────────────┤
│                              │
│     Page Content             │  ← background: var(--bg) (#f2f2f7)
│     (scrollable)             │     padding: 8px 0 + bottom padding
│                              │
│   ┌──────────────────────┐   │
│   │   Card / Section     │   │  ← margin: 0 16px 10px
│   └──────────────────────┘   │
│                              │
├──────────────────────────────┤
│   TabBar (conditional)       │  ← height: 50px + safe-bottom
│   🏠 Kontrakan  ⚙️ Pengaturan│     z-index: 100
└──────────────────────────────┘
```

CSS variables layout:
```css
:root {
  --status-bar: 20px;
  --navbar-height: 44px;
  --tab-bar: 50px;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

Content height:
```css
.content {
  padding-bottom: calc(var(--tab-bar) + var(--safe-bottom) + 8px);
  min-height: calc(100svh - var(--status-bar) - var(--navbar-height) - var(--tab-bar) - var(--safe-bottom));
}
```

---

## 3. Page Types

### 3.1 Tab Pages (PropertiesPage, SettingsPage)
- Navbar + BottomTabBar
- Konten scrollable
- Contoh: `/`, `/settings` — `screens/properties.html`, `screens/settings.html`

### 3.2 Push Pages (PropertyFormPage, TenantFormPage)
- Navbar (title dinamis) — tanpa bottom tabs
- Tombol back = browser back (react-router) / `.navbar-back` (prototype)
- Konten form di `padding: 16px` (`.form-wrap`)
- Contoh: `/property/new`, `/tenant/:id/edit` — `screens/property-form.html`, `screens/tenant-form.html`

### 3.3 Detail Pages (PropertyDetailPage, TenantDetailPage)
- Navbar — tanpa bottom tabs
- Daftar item (tenants/maintenance/payments)
- FAB atau ActionRow buttons
- Contoh: `/property/:id`, `/tenant/:id` — `screens/property-detail.html`, `screens/tenant-detail.html`

### 3.4 Overlay Pages (PaymentSheet, MaintenanceForm, ConfirmDialog)
- Bottom sheet (React) atau centered modal (prototype)
- Overlay `rgba(0,0,0,0.4)`
- Tidak ada Navbar
- Contoh: payment flow, maintenance add/edit

---

## 4. Spacing Grid

### React (Tailwind)
```
Page gutter:   mx-4 / px-4      = 16px kiri-kanan
Card margin:   mx-4 mb-3        = 16px horizontal, 12px bottom antar card
Card padding:  p-4              = 16px dalam card
Section gap:   space-y-4 / gap-3 = 16px / 12px
Form gap:      space-y-4        = 16px antar field
```

### Prototype (CSS)
```
Page gutter:   content inherits body padding — 16px via margin cards
Card margin:   0 16px 10px      = 16px horizontal, 10px bottom
Card padding:  14px 16px        = dalam card
Form gap:      20px             = margin-bottom form-group
Section head:  10px 16px 6px    = padding section header
Action row:    0 16px 12px      = padding action buttons
```

### Horizontal rhythm (sama)
```
[← 16px →][←   card (auto)  →][← 16px →]
```

### Vertical rhythm (halaman list)
```
Navbar / Status bar
  ↓ 8px
Section heading (13px semibold uppercase)
  ↓
Card (mx-4 mb-3 / margin:0 16px 10px)
Card (mx-4 mb-3)
Card (mx-4 mb-3)
  ↓
Section heading
  ↓
Card (mx-4 mb-2)
```

---

## 5. Safe Area & Navigation Sizing

### React — `index.css`
```css
#root {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
.bottom-tab-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 1000;
}
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

### Prototype — `:root` variables
```css
:root {
  --status-bar: 20px;
  --navbar-height: 44px;
  --tab-bar: 50px;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

| Token | React | Prototype | Purpose |
|-------|-------|-----------|---------|
| Status bar | none (browser native) | `20px` `.status-bar` | iOS status bar simulation |
| Navbar height | ~44px (Konsta default) | `44px` | Navigation bar |
| Tab bar height | Konsta default | `50px` | Bottom tab bar |
| Safe bottom | `env(safe-area-inset-bottom)` | `var(--safe-bottom)` | Home indicator |
| Content bottom pad | `pb-16` | `padding-bottom: calc(var(--tab-bar) + ...)` | Avoid tab overlay |

---

## 6. Screen-Specific Layouts (Prototype)

### PropertiesPage (`screens/properties.html`)
```
Status bar
Navbar: "Kontrakan" [Tambah]
Content:
  Section: "KONTRAKAN SAYA" · count
  PropertyCard × 3
  (atau EmptyState)
TabBar: 🏠 Kontrakan | ⚙️ Pengaturan
```

### PropertyDetailPage (`screens/property-detail.html`)
```
Status bar
Navbar: ← Kontrakan | Kos 24 | Edit
Content:
  PropHeaderCard (nama, lokasi, stats)
  SegmentedControl: [Penyewa] [Perbaikan]
  Penyewa panel:
    Section head "Penyewa Aktif · 2"
    TenantCard × 2
    ActionRow: [Tambah Penyewa]
  Perbaikan panel (hidden):
    Section head "Perbaikan · 2"
    MaintenanceItem × 2
    ActionRow: [Catat Perbaikan]
FAB: + (floating, bottom-right)
```

### TenantDetailPage (`screens/tenant-detail.html`)
```
Status bar
Navbar: ← Kontrakan | Andi Pratama | Edit
Content:
  InfoCard (nama, telepon, kontrakan, unit, harga, tgl masuk, jatuh tempo, status)
  Pay button: "Tandai Sudah Bayar"
  Section: "RIWAYAT PEMBAYARAN"
  PaymentItem × 3
  Deactivate button
Modals:
  #payModal — Catat Pembayaran
  #deleteModal — Hapus Pembayaran?
```

### SettingsPage (`screens/settings.html`)
```
Status bar
Navbar: "Pengaturan"
Content:
  Section "DATA"
  GroupedList: Export JSON, Export SQLite, Import Data
  Section "INFORMASI"
  GroupedList: Versi Aplikasi, Total Data
  Section "LAINNYA"
  GroupedList: Hapus Semua Data (destructive)
TabBar: 🏠 Kontrakan | ⚙️ Pengaturan
```

### PropertyForm (`screens/property-form.html`)
```
Status bar
Navbar: ← Batal | Tambah Kontrakan | Simpan
Content:
  FormGroup: Nama Kontrakan
  FormGroup: Lokasi
  FormGroup: Total Unit + hint
  (Edit mode: Delete button)
```

### TenantForm (`screens/tenant-form.html`)
```
Status bar
Navbar: ← Batal | Tambah Penyewa | Simpan
Content:
  FormGroup: Kontrakan (chip selector)
  FormGroup: Nama Penyewa
  FormGroup: No. Telepon
  FormGroup: Jumlah Unit + hint
  FormGroup: Harga Sewa
  FormGroup: Tanggal Masuk + hint
```

---

## 7. Z-Index Stacking

### React
```
Layer       Value     Element
────────────────────────────────
Base          auto    Page content
Navbar        z-40    Sticky navbar
Overlay       z-50    Modal/sheet backdrop
Sheet/Modal   z-50    Sheet & dialog content
```

### Prototype
```
Layer       Value     Element
────────────────────────────────
Tabs         z-100    Bottom tab bar
FAB          z-50     Floating action button
Overlay      z-200    Modal backdrop
Modal        z-200    Modal dialog content
```

---

## 8. Responsive Behavior

v1: **Mobile-first, tidak ada breakpoint tablet/desktop.**

| Property | Value |
|----------|-------|
| Max width konten | `auto` (full width) |
| Breakpoint | none (single column) |
| Orientation | portrait preferred, landscape tetap jalan |
| Prototype viewport | `width=390` (iPhone), `viewport-fit=cover` |

> **ponytail:** Jika ingin tablet/desktop di fase berikutnya, tambah container `max-w-lg mx-auto` untuk batasi lebar.
```
