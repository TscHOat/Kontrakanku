# Iconography

> v1 menggunakan **emoji** sebagai ikon — baik di React (Tailwind classes) maupun di prototype (native emoji). Prototype juga menyertakan **Ionicons** untuk ikon dekoratif tambahan. Tidak ada icon library weight berat (Font Awesome, Heroicons, Lucide).

---

## 1. Emoji as Icons

### React
```tsx
// Tab bar
<span className="text-xl">🏠</span>

// Empty state
<div className="mb-4 text-6xl">🏠</div>

// Loading screen
<div className="mb-4 text-4xl">🏠</div>
```

### Prototype
```html
<span class="icon">🏠</span>
```

---

## 2. Emoji Master List

| Konteks | Emoji | Size React | Size Prototype | Lokasi |
|---------|-------|-----------|----------------|--------|
| Tab: Kontrakan | 🏠 | `text-xl` | `font-size: 22px` | BottomTabBar / `.tabbar` |
| Tab: Pengaturan | ⚙️ | `text-xl` | `font-size: 22px` | BottomTabBar / `.tabbar` |
| Empty: Properties | 🏠 | `text-6xl` | `font-size: 56px` | EmptyState / `.empty-state` |
| Empty: Tenants | 👤 | `text-6xl` | — | EmptyState |
| Empty: Payments | 💳 | `text-6xl` | — | EmptyState |
| Empty: Maintenances | 🔧 | `text-6xl` | — | EmptyState |
| Loading screen | 🏠 | `text-4xl` | — | LoadingScreen |
| Settings icon | 📄 | — | `font-size: 20px` | GroupedList (Export JSON) |
| Settings icon | 🗄️ | — | `font-size: 20px` | GroupedList (Export SQLite) |
| Settings icon | 📥 | — | `font-size: 20px` | GroupedList (Import) |
| Settings icon | 📱 | — | `font-size: 20px` | GroupedList (Versi) |
| Settings icon | 💾 | — | `font-size: 20px` | GroupedList (Total Data) |
| Settings icon | 🗑️ | — | `font-size: 20px` | GroupedList (Hapus Semua) |

---

## 3. Icon Sizing

### React (Tailwind)
| Size Class | Rem | Use Case |
|-----------|-----|----------|
| `text-xl` | 1.25rem | Tab bar icons |
| `text-4xl` | 2.25rem | Loading screen |
| `text-6xl` | 3.75rem | Empty state illustrations |

### Prototype (CSS)
| Value | Use Case |
|-------|----------|
| `font-size: 22px` | Tab bar icons |
| `font-size: 20px` | List item icons (Settings) |
| `font-size: 56px` | Empty state emoji |

---

## 4. Ionicons (Prototype only)

Prototype menyertakan Ionicons via CDN untuk ikon dekoratif tambahan. **Tidak digunakan di React.**

```html
<!-- Di setiap screen HTML prototype -->
<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
```

Ionicons tidak benar-benar dipakai di elemen mana pun — tetap menggunakan emoji untuk semua ikon. Ini menunjukkan bahwa bahkan di prototype, emoji sudah cukup.

---

## 5. Rules

1. **Tidak ada ikon di dalam tombol aksi** — tombol hanya berisi teks (label aksi).
2. **Emoji hanya di tab bar, empty state, list item, dan loading screen** — tidak di card body atau form.
3. **Konsisten secara emoji** — jangan ganti 🏠 dengan 🏘️ di tempat lain.
4. **Cross-platform check** — emoji harus tampil sama di Chrome Android & Safari iOS. Hindari emoji baru (Unicode versi terbaru).
5. **Tidak ada ikon interaktif** — emoji hanya dekoratif, bukan target klik.
6. **Jangan tambah Ionicons** — CDN Ionicons ada di prototype untuk fleksibilitas, tetapi React tetap pakai emoji.

---

## 6. Future Considerations

> **ponytail:** Jika butuh ikon lebih variatif di fase berikutnya:
> - Pilih **Heroicons** (SVG, compatible dengan Tailwind sizing)
> - Alias `@heroicons/react/24/outline` — import per ikon (tree-shakeable)
> - Bundle size impact: ~5-10 kB per ikon yang digunakan

Tapi untuk v1, emoji sudah cukup.
