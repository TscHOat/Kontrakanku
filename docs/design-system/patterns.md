# Patterns & Interactions

> Pola interaksi reusable: loading, empty, error, form, status indicator, dan konfirmasi. Mencakup implementasi React di `src/components/` dan referensi dari Open Design prototype (`screens/`).

---

## 1. Loading State

### 1.1 Initial Loading (DB Init)
`src/pages/LoadingScreen.tsx` — Overlay penuh saat SQLite WASM loading.

```
┌──────────────────────────────┐
│                              │
│            🏠                │  ← font-size: 2.25rem
│         Memuat...            │  ← color: var(--fg-secondary)
│                              │
└──────────────────────────────┘
```

Trigger:
- `useDB().dbReady === false` di `App.tsx`
- `React.lazy` Suspense fallback

### 1.2 Button Loading
Button submit menampilkan teks "Menyimpan..." saat loading:
```tsx
<button disabled={loading}>
  {loading ? 'Menyimpan...' : 'Simpan'}
</button>
```

Button di-disabled dengan `opacity: 0.4-0.5` saat loading.
- React: `disabled:opacity-50`
- Prototype: `.pay-btn:disabled { opacity: 0.4; cursor: default }`

### 1.3 Card / List Loading
v1: **Tidak ada skeleton.** Data langsung muncul setelah query selesai.
> **ponytail:** Tambah skeleton shimmer jika query > 200ms di fase berikutnya.

---

## 2. Empty State

### React Pattern (`EmptyState` component)
```
┌──────────────────────────────┐
│                              │
│          🏠 (emoji)          │  ← 56px / text-6xl
│                              │
│     Belum ada kontrakan.     │  ← text-gray-500 / var(--fg-secondary)
│                              │
│  [Tambah Kontrakan Pertama]  │  ← bg var(--accent), rounded-10px
└──────────────────────────────┘
```

| Konteks | Emoji | Message | CTA |
|---------|-------|---------|-----|
| Properties | 🏠 | "Belum ada kontrakan." | "Tambah Kontrakan Pertama" |
| Tenants | 👤 | "Belum ada penyewa." | "Tambah Penyewa" |
| Payments | 💳 | "Belum ada pembayaran." | — (inline text) |
| Maintenances | 🔧 | "Belum ada perbaikan." | "Catat Perbaikan" |

Untuk payments: inline text — bukan EmptyState penuh.
```tsx
<p className="px-4 py-4 text-sm text-gray-400">Belum ada pembayaran.</p>
```

### Prototype Pattern (`.empty-state`)
```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 32px;
  text-align: center;
}
.empty-state .emoji { font-size: 56px; margin-bottom: 16px; }
.empty-state p { font-size: 15px; color: var(--fg-secondary); margin-bottom: 20px; }
.empty-state .btn-primary {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.empty-state .btn-primary:active { background: var(--accent-pressed); }
```

---

## 3. Error State

### React Pattern (`ErrorNotice`)
```
┌─── red border ───────────────┐
│ Gagal memuat data.           │  ← text-sm, var(--red-text)
│                              │
│ Coba lagi (link underline)   │  ← text-sm font-medium underline
└──────────────────────────────┘
```

Styling: `mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700`

### Prototype Pattern
Prototype tidak memiliki dedicated error component. Warna error menggunakan:
- `--red-bg` (#fee2e2) untuk background
- `--red-text` (#b91c1c) untuk teks
- `--red` (#ff3b30) untuk border/aksi destructive

---

## 4. Status Indicator (Bayar)

### React (`TenantCard` badge)
```
┌──────────────────────────────┐
│  Nama Penyewa       [Lunas]  │  ← bg-green-100 text-green-700
│  2 unit · Rp 1.000.000       │     (atau bg-red-100 text-red-700)
└──────────────────────────────┘
```

### Prototype (`.badge` di `tenant-card`)
```
┌──────────────────────────────┐
│  Andi Pratama    [Belum]     │  ← .badge.unpaid
│  2 unit · Rp 1.500.000       │     background: var(--red-bg)
└──────────────────────────────┘      color: var(--red-text)
```

| Status | React (Tailwind) | Prototype (CSS) |
|--------|-----------------|-----------------|
| Lunas | `bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 text-xs font-medium` | `.badge.paid` — `background: var(--green-bg); color: var(--green-text); border-radius: 999px; padding: 3px 10px` |
| Belum | `bg-red-100 text-red-700 ...` | `.badge.unpaid` — `background: var(--red-bg); color: var(--red-text)` |

Logika:
```ts
const isPaid = paidMonths.has(currentMonth)
// paidMonths: Set<string> of for_month values yang sudah dibayar
// currentMonth: format "YYYY-MM" (bulan berjalan)
```

---

## 5. Card Press Interaction

### React
```tsx
className="cursor-pointer active:scale-[0.98] transition-transform"
```

### Prototype
```css
.property-card:active { opacity: 0.7; }
.tenant-card:active { opacity: 0.7; }
```

Keduanya memberikan feedback visual. Prototype pakai `opacity: 0.7`, React pakai `scale(0.98)`.

---

## 6. Bottom Sheet / Modal Pattern

### React — Bottom Sheet (PaymentSheet, MaintenanceForm)
```tsx
<div className="fixed inset-0 z-50 flex items-end bg-black/40">
  <div className="w-full rounded-t-2xl bg-white p-6 pb-8 shadow-xl">
    <h3 className="mb-4 text-lg font-semibold text-center">Judul</h3>
    <div className="space-y-4">...</div>
    <div className="flex gap-3">
      <button className="flex-1 rounded-lg bg-gray-100 py-3 text-sm font-medium text-gray-600">Batal</button>
      <button className="flex-1 rounded-lg bg-green-500 py-3 text-sm font-medium text-white disabled:opacity-50">Konfirmasi</button>
    </div>
  </div>
</div>
```

### Prototype — Centered Modal (tenant-detail.html)
```css
.modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.4);
  padding: 32px;
}
.modal.open { display: flex; }
.modal-box {
  background: var(--surface);
  border-radius: 14px;
  padding: 20px;
  width: 100%;
  max-width: 300px;
}
.modal-actions { display: flex; gap: 8px; }
.modal-actions button {
  flex: 1;
  border: none;
  border-radius: 10px;
  padding: 11px;
  font-size: 15px;
  font-weight: 600;
}
.modal-actions .cancel { background: var(--surface); color: var(--accent); border: 0.5px solid var(--separator); }
.modal-actions .confirm { background: var(--green); color: #fff; }
.modal-actions .confirm.destructive { background: var(--red); }
```

### Pattern Decision
| Platform | Posisi | Radius | Uses |
|----------|--------|--------|------|
| React | Bottom sheet (`items-end`) | `rounded-t-2xl` (16px top) | PaymentSheet, MaintenanceForm |
| Prototype | Centered | `border-radius: 14px` | Confirm delete, payment form |

**Keputusan:** Implementasi React tetap pakai bottom sheet untuk form (payment & maintenance) dan centered modal untuk konfirmasi (ConfirmDialog).

---

## 7. Modal Dialog Pattern (ConfirmDialog)

### React
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
  <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
    <p className="mb-6 text-gray-600">{message}</p>
    <div className="flex gap-3 justify-end">
      <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">{cancelText}</button>
      <button onClick={onConfirm} className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${destructive ? 'bg-red-500' : 'bg-blue-500'}`}>{confirmText}</button>
    </div>
  </div>
</div>
```

### Prototype
```html
<div class="modal" id="deleteModal">
  <div class="modal-box">
    <h3>Hapus Pembayaran?</h3>
    <p id="deleteMsg">Hapus pembayaran periode ini?</p>
    <div class="modal-actions">
      <button class="cancel" onclick="hideDeleteModal()">Batal</button>
      <button class="confirm destructive" onclick="...">Hapus</button>
    </div>
  </div>
</div>
```

---

## 8. Toast Notification

### Prototype (`screens/settings.html`)
```css
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.85);
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 300;
  display: none;
}
```

```js
function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(t._timer);
  t._timer = setTimeout(function(){ t.style.display = 'none' }, 2500);
}
```

React saat ini belum memiliki toast component. Pattern dasar:
- Fixed bottom center
- Dark background (rgba(0,0,0,0.85))
- Auto-hide setelah 2.5s
- `z-index: 300`

> **ponytail:** Tambah komponen `Toast` jika notifikasi diperlukan lebih luas.

---

## 9. Segmented Control Pattern

### Prototype (`screens/property-detail.html`)
Tab switching antara "Penyewa" dan "Perbaikan":

```css
.segment-bar {
  display: flex;
  margin: 0 16px 12px;
  background: var(--surface);
  border-radius: 10px;
  padding: 2px;
  border: 0.5px solid var(--separator);
}
.segment.active {
  background: var(--accent);
  color: #fff;
}
```

Pattern ini bisa digunakan di halaman yang punya dua panel berbeda. React belum mengimplementasikannya.

---

## 10. Form Patterns

### Full Page Form (PropertyForm, TenantForm) — React & Prototype
```
Label (15px, medium)
┌──────────────────────────────┐
│ Input field                  │  ← border: 0.5px solid var(--border)
└──────────────────────────────┘  border-radius: 10px, padding: 12px 14px
Hint text (12px, var(--fg-tertiary))
```

### Bottom Sheet Form (PaymentSheet, MaintenanceForm) — React
```
┌──────────────────────────────┐
│        Judul Sheet           │  ← 17px semibold, center
├──────────────────────────────┤
│  Label                       │
│  ┌────────────────────────┐ │
│  │ Input / Select         │ │
│  └────────────────────────┘ │
├──────────────────────────────┤
│  [Batal]  [Konfirmasi]      │  ← flex gap-3, flex-1 each
└──────────────────────────────┘
```

### Centered Modal Form (Payment) — Prototype
```
┌──────────────────────────────┐
│     Catat Pembayaran         │
│  1 bulan = Rp 1.500.000     │
│                              │
│  Metode: [Select dropdown]   │
│  Periode: [Month input]      │
│                              │
│  [Batal]   [Konfirmasi Bayar]│
└──────────────────────────────┘
```

### Input Focus Style (sama di semua)
```css
/* React */
focus:border-blue-500 focus:outline-none

/* Prototype */
.form-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(0,122,255,0.15);
}
```

### Delete Button Pattern (Property Form)
```css
.delete-btn {
  width: 100%;
  background: none;
  border: 0.5px solid var(--red);
  border-radius: 10px;
  padding: 14px;
  font-size: 15px;
  font-weight: 500;
  color: var(--red);
  cursor: pointer;
}
.delete-btn:active { opacity: 0.6; }
```
- Dua tombol di `justify-end` — tidak full-width (beda dengan sheet)

---

## 8. Form Submission Pattern

Semua form mengikuti pola yang sama:

```tsx
const [loading, setLoading] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!valid) return
  setLoading(true)
  try {
    await onSubmit(data)
  } finally {
    setLoading(false)
  }
}

// Validasi: computed boolean dari state
const valid = name.trim() && location.trim() && Number(totalUnits) > 0

<button type="submit" disabled={!valid || loading}>
  {loading ? 'Menyimpan...' : 'Simpan'}
</button>
```

Rules:
1. `e.preventDefault()` di handler
2. Validasi frontend sebelum submit
3. `setLoading(true)` sebelum async
4. `disabled={!valid || loading}` — cegah double submit
5. Button text berubah saat loading

---

## 9. Read-only Field Pattern

Untuk field yang tidak bisa diedit (jumlah bayar otomatis):

```tsx
<div className="rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-600">
  Rp {rentPrice.toLocaleString('id-ID')}
</div>
```

Visual: background gray-100, tanpa border — kontras dengan input editable (white bg + border).

---

## 10. Delete/Nonaktif Cascade

Flow:
```
User tap "Hapus"
  → ConfirmDialog muncul
  → User konfirmasi "Hapus"
  → Hapus data + cascade (DB constraints di handle via app code)
  → Navigasi/refresh
```

Untuk nonaktifkan penyewa (bukan hapus):
```
User tap "Nonaktifkan"
  → ConfirmDialog konfirmasi
  → set isActive = false
  → Data pembayaran tetap tersimpan
```

---

## 11. Search Pattern

Search bar untuk filter tenant di PropertyDetailPage:

```tsx
<input
  type="text"
  placeholder="Cari penyewa..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
/>
```

Filter dilakukan di memory dari hasil query Drizzle — tidak perlu query ulang ke DB.

---

## 12. Navigation Patterns

| Action | Navigasi |
|--------|----------|
| Tap card | `navigate('/property/:id')` |
| Tap "+" tambah | `navigate('/property/new')` |
| Tap edit | `navigate('/property/:id/edit')` |
| Back | Browser back / react-router `useNavigate().back()` |
| Tab switch | `navigate('/')` atau `navigate('/settings')` |

Page transition: **instant** — tidak ada animasi di v1.

---

## 13. Format Patterns

### Rupiah
```ts
amount.toLocaleString('id-ID')
// Output contoh: "1.000.000"
```

### Bulan (for_month → label)
```ts
// "2026-07" → "Juli 2026"
monthLabel(forMonth) // dari src/lib/date.ts
```

### Tanggal
```ts
// Format input: "YYYY-MM-DD"
// Format tampilan: via helper di src/lib/date.ts
```
