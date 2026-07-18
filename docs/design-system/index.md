# Design System — Kontrakan PWA

> Panduan visual dan komponen untuk aplikasi Kontrakan PWA. Dua representasi:
> 1. **React** — Tailwind CSS v4 + Konsta UI 5 (Material theme)
> 2. **Prototype (Open Design)** — HTML/CSS murni dengan iOS 18 styling lihat di Open Design project "Web Prototype" (`screens/`)
>
> Mobile-first, offline-first.

---

## Prinsip

1. **Utility-first** — Styling via Tailwind utility classes (React) atau CSS custom properties (prototype).
2. **Prototype sebagai reference** — Open Design project "Web Prototype" berisi 6 screens HTML yang merepresentasikan visual ideal. Doc ini merujuk pada kedua implementasi.
3. **Konsisten, bukan kaku** — Pattern reusable, tidak over-abstract.
4. **Bundle kecil** — Emoji sebagai ikon. Tidak ada icon library weight berat.

---

## Tech Stack

| Layer | React | Prototype (Open Design) |
|-------|-------|------------------------|
| UI framework | React 19 | HTML static |
| Styling | Tailwind CSS v4 | CSS custom properties |
| Mobile UI | Konsta UI 5 (Material) | Custom iOS 18 style |
| Icon | Emoji (native) | Emoji + Ionicons (via CDN, tidak dipakai) |
| Font | System stack | SF Pro → system stack |

---

## File Index

| File | Isi |
|------|-----|
| [`design-tokens.md`](./design-tokens.md) | Colors, typography, spacing, radius, shadow, z-index, transitions, safe area |
| [`components.md`](./components.md) | Semua UI components — React + referensi prototype CSS |
| [`layout.md`](./layout.md) | Page anatomy (React + prototype), spacing grid, safe area, screen layouts |
| [`patterns.md`](./patterns.md) | Loading, empty, error, status, sheet, modal, toast, form patterns |
| [`iconography.md`](./iconography.md) | Emoji master list, sizing, Ionicons (prototype only) |

---

## Quick Reference

### Warna Kunci — Prototype (iOS 18)
```
Accent:   #007aff        → Tombol, link, focus, active tab
Red:      #ff3b30        → Destructive, hapus
Green:    #34c759        → Bayar, unit kosong
Bg:       #f2f2f7        → Background halaman
Surface:  #ffffff        → Card, sheet, navbar
Text:     #000000 / #3c3c43 / #8e8e93  → Hierarki teks
Border:   #c6c6c8        → Input, separator
Overlay:  rgba(0,0,0,0.4)→ Backdrop modal
```

### Warna Kunci — React (Tailwind)
```
Primary:   blue-500      → Tombol, link, fokus
Success:   green-{100,500,600,700} → Lunas, unit kosong
Error:     red-{100,500,700}       → Belum bayar, destructive
Surface:   white         → Card, sheet
Page bg:   gray-50       → Background halaman
Text:      gray-{400,500,600,700}  → Hierarki teks
Border:    gray-300      → Input, separator
Overlay:   black/40      → Backdrop modal
```

### Spacing Kunci
```
Page gutter:   16px (mx-4 / padding: 0 16px)
Card margin:   0 16px 10px (mx-4 mb-3)
Card padding:  14px 16px / 16px (p-4)
Form gap:      20px (space-y-4)
Modal padding: 20px (p-6)
```

### Radius Kunci
```
Card:    12px  (rounded-xl / border-radius: 12px)
Button:  10px  (rounded-lg / border-radius: 10px)
Modal:   14px  (rounded-2xl / border-radius: 14px)
Badge:   999px (rounded-full)
```

---

## Open Design Prototype — Screen Inventory

Project: **Web Prototype** (Open Design)
6 screens di folder `screens/`:

| Screen | File | Deskripsi |
|--------|------|-----------|
| Properties | `screens/properties.html` | Daftar kontrakan + empty state |
| Property Detail | `screens/property-detail.html` | Detail kontrakan + segmented control |
| Tenant Detail | `screens/tenant-detail.html` | Detail penyewa + payment modal |
| Settings | `screens/settings.html` | Grouped list iOS style |
| Property Form | `screens/property-form.html` | Tambah/edit kontrakan |
| Tenant Form | `screens/tenant-form.html` | Tambah/edit penyewa |

Lihat [`layout.md`](./layout.md) untuk anatomy tiap screen.

---

## Cara Menggunakan

1. **Baca [design-tokens.md](./design-tokens.md)** dulu — paham CSS variables iOS 18 vs Tailwind.
2. **Cek [components.md](./components.md)** — lihat komponen + mapping React ↔ prototype CSS.
3. **Gunakan [patterns.md](./patterns.md)** — ikuti pola form, sheet, konfirmasi dari kedua sumber.
4. **File baru?** — Ikuti struktur di [layout.md](./layout.md). Lihat screen-specific layout.
5. **Butuh ikon?** — Cek [iconography.md](./iconography.md). Emoji dulu.
6. **Lihat prototype langsung?** — Buka Open Design project "Web Prototype" → preview URL.

---

## Catatan v1

- **Light mode only** — dark mode tidak didukung
- **No page transitions** — instant switch
- **No skeleton loading** — spinner hanya di inisialisasi DB
- **Single column** — mobile-first, tanpa breakpoint
- **Prototype viewport** — `width=390` (iPhone), `viewport-fit=cover`
