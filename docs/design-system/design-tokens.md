# Design Tokens

> Referensi visual untuk `docs/design-system/`. Token didefinisikan sebagai CSS custom properties di setiap screen HTML prototype. Tidak menggunakan Tailwind di prototype — langsung CSS variables dengan Apple HIG-inspired values.

---

## 1. Color Palette

Semua warna didefinisikan di `:root` tiap screen HTML. Konsisten di semua halaman.

### Brand / Accent
| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `--accent` | `#007aff` | #007aff | Tombol utama, link, fokus input, active tab |
| `--accent-pressed` | `#005bbf` | #005bbf | Tekan tombol primary |

### Status / Semantic
| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `--red` | `#ff3b30` | #ff3b30 | Aksi destructive, hapus |
| `--green` | `#34c759` | #34c759 | Tombol bayar, unit kosong |
| `--orange` | `#ff9500` | #ff9500 | Status pending maintenance |
| `--red-bg` | `#fee2e2` | #fee2e2 | Badge "Belum Bayar" bg |
| `--red-text` | `#b91c1c` | #b91c1c | Badge "Belum Bayar" text |
| `--green-bg` | `#dcfce7` | #dcfce7 | Badge "Lunas" bg |
| `--green-text` | `#15803d` | #15803d | Badge "Lunas" text |

### Neutral — iOS 18 Palette
| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `--bg` | `#f2f2f7` | #f2f2f7 | Background halaman (systemGray6) |
| `--surface` | `#ffffff` | #ffffff | Card, sheet, dialog, navbar |
| `--fg` | `#000000` | #000000 | Teks utama (label) |
| `--fg-secondary` | `#3c3c43` | #3c3c43 | Teks sekunder (secondaryLabel) |
| `--fg-tertiary` | `#8e8e93` | #8e8e93 | Hint, caption, placeholder (tertiaryLabel) |
| `--border` | `#c6c6c8` | #c6c6c8 | Border input, chip |
| `--separator` | `rgba(60,60,67,0.12)` | rgba(60,60,67,0.12) | Separator, border bottom navbar |

### Semantic Mapping (per konteks)
| Konteks | Value |
|---------|-------|
| Aksi utama (simpan, tambah) | `var(--accent)` → #007aff |
| Aksi bayar | `var(--green)` → #34c759 |
| Aksi destructive (hapus) | `var(--red)` → #ff3b30 |
| Status lunas | `var(--green-bg)` bg + `var(--green-text)` text |
| Status belum bayar | `var(--red-bg)` bg + `var(--red-text)` text |
| Status pending | `rgba(255,149,0,0.15)` bg + `var(--orange)` text |
| Link / edit | `var(--accent)` text |
| Tombol batal / cancel | `var(--surface)` bg + `var(--fg)` text + border |

---

## 2. Typography

| Token | Value | Usage |
|-------|-------|-------|
| `font-family` | `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, sans-serif` | Body text — SF Pro prioritas |
| `base-size` | `17px` | Font size default iOS |
| `heading-hero` | `20px font-weight:700` | Nama properti di header card |
| `heading-title` | `17px font-weight:600` | Navbar title, modal title |
| `heading-card` | `16px font-weight:600` | Nama penyewa di tenant card |
| `body` | `15px` | Konten, label form |
| `body-small` | `14px` | Info tambahan, subtext |
| `caption` | `13px` | Section header, hint |
| `caption-small` | `12px` | Badge text, metadata |
| `badge` | `11-13px font-weight:500` | Status badge, maint status |
| `price` | `font-weight:600` (pakai `toLocaleString('id-ID')`) | Nominal harga |

### Hierarki Typografi
```
Page title (Navbar)   → 17px semibold, center
Property name         → 20px bold (prop-header)
Card title            → 16px semibold
Section heading       → 13px semibold uppercase (.section-head)
Body / label          → 15px
Hint / caption        → 12-13px
Badge                 → 12px medium (rounded-full)
```

---

## 3. Spacing

| Token | Rem/px | Usage |
|-------|--------|-------|
| `page-gutter` | `16px` | Padding kiri-kanan konten |
| `card-margin` | `0 16px 10px` | Margin card properties |
| `card-margin-detail` | `0 16px 8px` | Margin tenant/maint card |
| `card-padding` | `14px 16px` / `16px` | Padding dalam card |
| `form-gap` | `20px` | Jarak antar form group |
| `btn-padding` | `12px 24px` / `14px` | Padding tombol |
| `sheet-padding` | `20px` | Padding dalam modal box |
| `gap-default` | `10px` | Gap action row buttons |
| `section-head-padding` | `10px 16px 6px` | Section header |
| `empty-state-py` | `60px` | Padding vertikal empty state |

---

## 4. Border Radius

| Token | px | Usage |
|-------|-----|-------|
| `radius-card` | `12px` | Card properti, tenant, info card |
| `radius-btn` | `10px` | Tombol, input, chip |
| `radius-sheet` | `14px` | Modal dialog |
| `radius-badge` | `999px` | Status badge |
| `radius-modal` | `14px` | Modal box |
| `radius-segment` | `8px` | Segmen aktif dalam segmented control |
| `radius-chip` | `8px` | Property selector chip |

---

## 5. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.04)` | Card default |
| `shadow-sheet` | `—` | Modal (via iOS blur) |
| `shadow-fab` | `0 4px 12px rgba(0,122,255,0.3)` | Floating action button |

---

## 6. Z-Index Scale

| Level | Value | Element |
|-------|-------|---------|
| `navbar` | `—` | Position:relative (static flow) |
| `fab` | `50` | Floating action button |
| `overlay` | `200` | Modal backdrop |
| `modal` | `200` | Modal dialog content |
| `tabbar` | `100` | Bottom tab bar |

---

## 7. Transitions & Interactions

| Token | Value | Usage |
|-------|-------|-------|
| `card-press` | `:active { opacity: 0.7 }` | Feedback tekan card |
| `btn-press` | `:active { opacity: 0.5-0.7 }` | Feedback button |
| `fab-press` | `:active { transform: scale(0.95) }` | FAB tekan |

Tidak ada CSS transition durations — semua instant, pakai `:active` pseudo-class.

---

## 8. Safe Area & Navigation Sizing

```css
:root {
  --status-bar: 20px;
  --navbar-height: 44px;
  --tab-bar: 50px;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

| Token | Value | Usage |
|-------|-------|-------|
| `--status-bar` | `20px` | iOS status bar |
| `--navbar-height` | `44px` | Navigation bar height |
| `--tab-bar` | `50px` | Bottom tab bar height |
| `--safe-bottom` | `env(safe-area-inset-bottom, 0px)` | Home indicator iOS |
