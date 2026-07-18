# Component Library

> Daftar semua komponen UI — baik implementasi React di `src/components/` maupun referensi visual dari Open Design prototype (HTML screens di Open Design project "Web Prototype"). Komponen React pakai Tailwind + Konsta UI. Prototype HTML pakai CSS custom properties dengan iOS 18 styling.

---

## Table of Contents

1. [EmptyState](#emptystate)
2. [ErrorNotice](#errornotice)
3. [ConfirmDialog / Modal](#confirmdialog--modal)
4. [PaymentSheet](#paymentsheet)
5. [PropertyCard](#propertycard)
6. [TenantCard](#tenantcard)
7. [PaymentHistory](#paymenthistory)
8. [PropertyForm](#propertyform)
9. [TenantForm](#tenantform)
10. [MaintenanceForm](#maintenanceform)
11. [Navbar](#navbar)
12. [BottomTabBar](#bottomtabbar)
13. [AppLayout](#applayout)
14. [LoadingScreen](#loadingscreen)
15. [SegmentedControl](#segmentedcontrol) — ada di prototype
16. [PropHeaderCard](#propheadercard) — ada di prototype
17. [FAB](#fab) — ada di prototype
18. [ActionRow](#actionrow) — ada di prototype
19. [GroupedList](#groupedlist) — ada di prototype (Settings)
20. [StatusBar](#statusbar) — ada di prototype

---

## EmptyState

**React:** `src/components/ui/EmptyState.tsx`
**Prototype:** `.empty-state` class di `screens/properties.html`

| Source | Container | Emoji | Message | CTA Button |
|--------|-----------|-------|---------|------------|
| React (Tailwind) | `flex flex-col items-center justify-center py-16 px-4` | `text-6xl` | `text-gray-500` | `rounded-lg bg-blue-500 px-6 py-2 text-white font-medium` |
| Prototype (CSS) | `.empty-state` — flex column, `padding: 60px 32px` | `font-size: 56px` | `color: var(--fg-secondary)` | `.btn-primary` — `background: var(--accent); border-radius: 10px; padding: 12px 24px` |

Props (React):
| Prop | Tipe | Default | Deskripsi |
|------|------|---------|-----------|
| `message` | `string` | required | Teks utama |
| `actionLabel` | `string?` | — | Label tombol CTA |
| `onAction` | `() => void?` | — | Handler klik tombol |

Rules:
- Emoji ganti per konteks (🏠 properti, 👤 penyewa, 🔧 perbaikan)
- Tombol hanya muncul jika kedua `actionLabel` + `onAction` ada
- Prototype: `.btn-primary:active { background: var(--accent-pressed) }`

---

## ErrorNotice

**React:** `src/components/ui/ErrorNotice.tsx`

Props:
```ts
interface ErrorNoticeProps {
  message: string
  onRetry?: () => void
}
```

Styling:
- Container: `mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700`
- Tombol retry: `text-sm font-medium underline`
- Prototype equivalent: menggunakan `--red-bg` (#fee2e2) dan `--red-text` (#b91c1c)

---

## ConfirmDialog / Modal

**React:** `src/components/ui/ConfirmDialog.tsx`
**Prototype:** `.modal` class di `screens/tenant-detail.html`

| Aspek | React (Tailwind) | Prototype (CSS) |
|-------|-----------------|-----------------|
| Overlay | `fixed inset-0 z-50 bg-black/40` | `position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.4)` |
| Box | `max-w-sm rounded-2xl bg-white p-6 shadow-xl` | `border-radius:14px; padding:20px; max-width:300px; background:var(--surface)` |
| Title | `text-lg font-semibold` | `font-size:17px; font-weight:600; text-align:center` |
| Body | `text-gray-600` | `font-size:13px; color:var(--fg-secondary); text-align:center` |
| Cancel btn | `rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100` | `background:var(--surface); color:var(--accent); border-radius:10px` |
| Confirm destructive | `rounded-lg px-4 py-2 bg-red-500 text-white` | `background:var(--red); color:#fff; border-radius:10px` |
| Confirm primary | `rounded-lg px-4 py-2 bg-blue-500 text-white` | `background:var(--green); color:#fff` — untuk pay |

Props (React):
| Prop | Tipe | Default | Deskripsi |
|------|------|---------|-----------|
| `open` | `boolean` | required | Kontrol visibilitas |
| `title` | `string` | required | Judul dialog |
| `message` | `string` | required | Body teks |
| `confirmText` | `string` | `'Hapus'` | Label tombol konfirmasi |
| `cancelText` | `string` | `'Batal'` | Label tombol batal |
| `onConfirm` | `() => void` | required | Handler konfirmasi |
| `onCancel` | `() => void` | required | Handler batal |
| `destructive` | `boolean` | `false` | Jika true → tombol `var(--red)` |

---

## PaymentSheet

**React:** `src/components/payments/PaymentSheet.tsx`
**Prototype:** `.modal` dengan form di `screens/tenant-detail.html` (#payModal)

React — bottom sheet style:
```
fixed inset-0 z-50 flex items-end bg-black/40
  └─ w-full rounded-t-2xl bg-white p-6 pb-8 shadow-xl
```

Prototype — centered modal style:
```
.modal — fixed inset-0 z-200 bg rgba(0,0,0,0.4) flex center
  └─ .modal-box — border-radius:14px; max-width:300px
```

**Keputusan desain:** Prototype menggunakan modal centered (bukan bottom sheet). Implementasi React bisa bottom sheet atau centered — konsisten dengan modal pattern.

Props (React):
```ts
interface PaymentSheetProps {
  open: boolean
  rentPrice: number
  entryDate: string
  defaultForMonth?: string
  onConfirm: (data: { amount: number; paymentMethod: string; forMonth: string }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}
```

Fields: Amount (readonly), Payment Method (select: Cash/Transfer/QRIS/Lainnya), Period (month input)

---

## PropertyCard

**React:** `src/components/properties/PropertyCard.tsx`
**Prototype:** `.property-card` di `screens/properties.html`

| Aspek | React (Tailwind) | Prototype (CSS) |
|-------|-----------------|-----------------|
| Container | `mx-4 mb-3 rounded-xl bg-white p-4 shadow-sm` | `margin:0 16px 10px; border-radius:12px; padding:14px 16px; background:var(--surface); box-shadow:0 1px 3px rgba(0,0,0,0.04)` |
| Name | `text-lg font-semibold` | `font-size:17px; font-weight:600` |
| Location | `text-sm text-gray-500` | `font-size:15px; color:var(--fg-secondary)` |
| Stats row | `flex items-center gap-4 text-sm` | `flex; gap:8px; font-size:14px` |
| Vacant number | `text-green-600 font-semibold` | `color:var(--green); font-weight:600` |
| Press effect | `active:scale-[0.98] transition-transform` | `:active { opacity: 0.7 }` |

---

## TenantCard

**React:** `src/components/tenants/TenantCard.tsx`
**Prototype:** `.tenant-card` di `screens/property-detail.html`

| Aspek | React (Tailwind) | Prototype (CSS) |
|-------|-----------------|-----------------|
| Container | `mx-4 mb-2 rounded-xl bg-white p-4 shadow-sm` | `margin:0 16px 8px; border-radius:12px; padding:14px 16px; background:var(--surface)` |
| Name | `font-medium` | `font-size:16px; font-weight:600` |
| Subtext | `text-sm text-gray-500` | `font-size:14px; color:var(--fg-secondary)` |
| Badge lunas | `bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 text-xs font-medium` | `background:var(--green-bg); color:var(--green-text); border-radius:999px; padding:3px 10px; font-size:12px; font-weight:500` |
| Badge belum | `bg-red-100 text-red-700 ...` | `background:var(--red-bg); color:var(--red-text) ...` |

---

## PaymentHistory

**React:** `src/components/tenants/PaymentHistory.tsx`
**Prototype:** `.payment-item` di `screens/tenant-detail.html`

| Aspek | React | Prototype CSS |
|-------|-------|---------------|
| Item | `rounded-lg bg-white p-3 shadow-sm` | `border-radius:10px; padding:12px 14px; background:var(--surface); box-shadow:0 1px 3px rgba(0,0,0,0.04)` |
| Month | `font-medium` | `font-size:15px; font-weight:500` |
| Amount | — | `font-size:15px; font-weight:600; color:var(--green)` |
| Edit btn | `text-blue-500 hover:underline` | `color:var(--accent)` |
| Delete btn | `text-red-500 hover:underline` | `color:var(--red)` |
| Empty | `text-sm text-gray-400` | prototype: `.empty-text` — `padding:20px 16px; text-align:center; font-size:14px; color:var(--fg-tertiary)` |

---

## PropertyForm

**React:** `src/components/properties/PropertyForm.tsx`
**Prototype:** `screens/property-form.html`

| Aspek | React (Tailwind) | Prototype (CSS) |
|-------|-----------------|-----------------|
| Container | `space-y-4` | `.form-wrap` — `padding:16px` |
| Form group | `mb-1 block text-sm font-medium text-gray-700` | `.form-group` — `margin-bottom:20px` |
| Label | `mb-1 block text-sm font-medium text-gray-700` | `font-size:15px; font-weight:500; color:var(--fg); margin-bottom:6px` |
| Input | `w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none` | `width:100%; border:0.5px solid var(--border); border-radius:10px; padding:12px 14px; font-size:16px; background:var(--surface)` |
| Input focus | `focus:border-blue-500 focus:outline-none` | `border-color:var(--accent); box-shadow:0 0 0 2px rgba(0,122,255,0.15)` |
| Hint | `text-xs text-gray-400` | `.hint` — `font-size:12px; color:var(--fg-tertiary); margin-top:4px` |
| Delete btn | — | `.delete-btn` — `border:0.5px solid var(--red); border-radius:10px; padding:14px; color:var(--red)` |

Props (React):
```ts
interface PropertyFormProps {
  initial?: NewProperty
  onSubmit: (data: NewProperty) => Promise<void>
  loading: boolean
}
```

Fields: Nama Kontrakan (text), Lokasi (text), Total Unit (number)

---

## TenantForm

**React:** `src/components/tenants/TenantForm.tsx`
**Prototype:** `screens/tenant-form.html`

Fitur tambahan di prototype — **Property Selector** (chip-style):
```css
.prop-chip {
  border: 0.5px solid var(--border);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 15px;
  cursor: pointer;
}
.prop-chip.selected {
  border-color: var(--accent);
  background: rgba(0,122,255,0.08);
  color: var(--accent);
  font-weight: 500;
}
```

Props (React):
```ts
interface TenantFormProps {
  initial?: Partial<NewTenant>
  propertyId: number
  maxUnits: number
  onSubmit: (data: NewTenant) => Promise<void>
  loading: boolean
}
```

Fields: Nama (text), No. Telepon (tel), Jumlah Unit (number, ≤ maxUnits), Harga Sewa (number), Tanggal Masuk (date)

---

## MaintenanceForm

**React:** `src/components/maintenances/MaintenanceForm.tsx`

Props:
```ts
interface MaintenanceFormProps {
  initial?: Partial<NewMaintenance>
  propertyId: number
  onSubmit: (data: NewMaintenance) => Promise<void>
  onCancel: () => void
  loading: boolean
}
```

Fields: Judul (text), Detail (textarea opsional), Biaya (number), Tanggal (date)

**PENTING:** MaintenanceForm menggunakan bottom sheet (sama dengan PaymentSheet), bukan halaman penuh.

---

## Navbar

**React:** `import { Navbar } from 'konsta/react'` — sticky, `z-40`
**Prototype:** `.navbar` — custom CSS iOS 18 style

| Aspek | React (Konsta) | Prototype (CSS) |
|-------|---------------|-----------------|
| Height | default Konsta (~44px) | `--navbar-height: 44px` |
| Background | default Konsta | `background: var(--surface)` |
| Separator | — | `border-bottom: 0.5px solid var(--separator)` |
| Title | via `title` prop | `font-size: 17px; font-weight: 600; position: absolute; left: 50%; transform: translateX(-50%)` |
| Back btn | — | `.navbar-back` — `color: var(--accent); font-size: 17px; display:flex; align-items:center; gap:4px` |
| Action btn | — | `.navbar-btn` — `color: var(--accent); font-size: 17px; padding: 4px 0` |

Prototype Navbar anatomy:
```
┌──────────────────────────────┐
│ ← Kembali    Title     Edit →│
│ (accent)    17px       (accent)
│             semibold
└──────────────────────────────┘
  0.5px separator (var(--separator))
```

Title mapping:
```ts
const titles: Record<string, string> = {
  '/': 'Kontrakan',
  '/settings': 'Pengaturan',
}
```

---

## BottomTabBar

**React:** `src/components/layout/BottomTabBar.tsx` — via Konsta `<Tabbar>`
**Prototype:** `.tabbar` — custom CSS fixed bottom

| Aspek | React (Konsta) | Prototype (CSS) |
|-------|---------------|-----------------|
| Position | `fixed bottom-0` | `position:fixed; bottom:0; left:0; right:0; z-index:100` |
| Height | default Konsta | `height: calc(var(--tab-bar) + var(--safe-bottom))` |
| Background | default Konsta | `background: var(--surface)` |
| Border top | — | `border-top: 0.5px solid var(--separator)` |
| Items | Konsta `TabbarLink` | `.tabbar-item` — flex column, center |
| Icon | `text-xl` emoji | `font-size: 22px` |
| Label | Konsta default | `font-size: 10px; color: var(--fg-tertiary)` |
| Active label | — | `color: var(--accent)` |

Tabs:
| Tab | Label | Icon | Route |
|-----|-------|------|-------|
| 1 | Kontrakan | 🏠 | `/` |
| 2 | Pengaturan | ⚙️ | `/settings` |

Rules:
- Hanya tampil di route tab (`/` dan `/settings`)
- Prototype: safe area bottom via `padding-bottom: var(--safe-bottom)`

---

## AppLayout

**React:** `src/components/layout/AppLayout.tsx`

```tsx
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      <Navbar title={title} className="sticky top-0 z-40" />
      <main className="pb-16">
        <Outlet />
      </main>
      {showTabs && <BottomTabBar />}
    </div>
  )
}
```

Struktur:
```
┌──────────────────────────────┐
│         Navbar (sticky)      │  ← z-40
├──────────────────────────────┤
│                              │
│     <Outlet /> (halaman)     │  ← pb-16
│                              │
├──────────────────────────────┤
│   BottomTabBar (conditional) │  ← safe-area-bottom
└──────────────────────────────┘
```

---

## LoadingScreen

**React:** `src/pages/LoadingScreen.tsx`
**Prototype:** tidak ada screen spesifik

```tsx
export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-4 text-4xl">🏠</div>
        <p className="text-gray-500">Memuat...</p>
      </div>
    </div>
  )
}
```

---

## SegmentedControl

**Prototype:** `.segment-bar` di `screens/property-detail.html`

Komponen ini **hanya ada di prototype** (belum diimplementasikan di React).

```css
.segment-bar {
  display: flex;
  margin: 0 16px 12px;
  background: var(--surface);
  border-radius: 10px;
  padding: 2px;
  border: 0.5px solid var(--separator);
}
.segment {
  flex: 1;
  text-align: center;
  padding: 7px 0;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  color: var(--fg-secondary);
}
.segment.active {
  background: var(--accent);
  color: #fff;
}
```

Anatomi:
```
┌──────────────────────────────┐
│  [  Penyewa  ] [ Perbaikan ] │  ← active: bg var(--accent)
│     var(--surface) bg        │     0.5px separator border
└──────────────────────────────┘
```

**Ponytail:** Tambah komponen React `SegmentedControl` jika segment switching diperlukan di halaman lain.

---

## PropHeaderCard

**Prototype:** `.prop-header` di `screens/property-detail.html`

```
┌──────────────────────────────┐
│  Kos 24                  ← 20px bold
│  Jl. Merpati No.24      ← 15px fg-secondary
│                              │
│  Total Unit    Terisi   Kosong│
│  5 (accent)    2 (green) 3 (green)│
└──────────────────────────────┘
```

```css
.prop-header {
  background: var(--surface);
  margin: 0 16px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
```

---

## FAB (Floating Action Button)

**Prototype:** `.fab` di `screens/property-detail.html`

```
         ┌───┐
         │ + │  ← 52x52, bg var(--accent), white text
         └───┘     shadow: 0 4px 12px rgba(0,122,255,0.3)
                 position: fixed; bottom: 24px; right: 16px; z-index: 50
```

```css
.fab {
  position: fixed;
  bottom: 24px;
  right: 16px;
  width: 52px;
  height: 52px;
  border-radius: 26px;
  background: var(--accent);
  color: #fff;
  font-size: 28px;
  box-shadow: 0 4px 12px rgba(0,122,255,0.3);
  z-index: 50;
}
.fab:active {
  background: var(--accent-pressed);
  transform: scale(0.95);
}
```

---

## ActionRow

**Prototype:** `.action-row` di `screens/property-detail.html`

Dua tombol sejajar (flex) untuk CTA di dalam konten.

```css
.action-row {
  display: flex;
  gap: 10px;
  padding: 0 16px 12px;
}
.action-row .btn {
  flex: 1;
  border: none;
  border-radius: 10px;
  padding: 11px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.action-row .btn-primary {
  background: var(--accent);
  color: #fff;
}
.action-row .btn-secondary {
  background: var(--surface);
  color: var(--fg);
  border: 0.5px solid var(--border);
}
```

---

## GroupedList

**Prototype:** `.list-group` / `.list-item` di `screens/settings.html`

iOS Settings-style grouped list:

```css
.list-group {
  margin: 16px 16px 0;
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface);
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 0.5px solid var(--separator);
  cursor: pointer;
}
.list-item:last-child { border-bottom: none; }
```

Item types:
| Type | Style |
|------|-------|
| Normal | `label: font-size:16px; right: hint + arrow (›)` |
| Destructive | `label: color: var(--red)` |
| With icon | `icon: font-size:20px; width:28px; text-align:center` |

Section header:
```css
.section-header {
  padding: 10px 16px 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--fg-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
```

---

## StatusBar

**Prototype:** `.status-bar` di setiap screen HTML

Hanya ada di prototype (simulasi iOS status bar). Tidak perlu diimplementasi di React — browser sudah handle sendiri.

```css
.status-bar {
  height: var(--status-bar);    /* 20px */
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--fg);
}
```
