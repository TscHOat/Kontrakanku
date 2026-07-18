import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { NewTenant } from '@/types'

interface TenantFormProps {
  initial?: Partial<NewTenant>
  propertyId: number
  maxUnits: number
  onSubmit: (data: NewTenant) => Promise<void>
  loading: boolean
}

export default function TenantForm({
  initial,
  propertyId,
  maxUnits,
  onSubmit,
  loading,
}: TenantFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [rentedUnits, setRentedUnits] = useState(String(initial?.rentedUnits ?? ''))
  const [rentPrice, setRentPrice] = useState(String(initial?.rentPrice ?? ''))
  const [entryDate, setEntryDate] = useState(initial?.entryDate ?? '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !rentedUnits || !rentPrice || !entryDate) return

    const units = Number(rentedUnits)
    if (units > maxUnits) {
      alert(`Unit yang disewa (${units}) melebihi unit kosong (${maxUnits})`)
      return
    }

    await onSubmit({
      propertyId,
      name: name.trim(),
      phone: phone.trim(),
      rentedUnits: units,
      rentPrice: Number(rentPrice),
      entryDate,
      isActive: true,
    })
  }

  const valid =
    name.trim() && phone.trim() && Number(rentedUnits) > 0 && Number(rentPrice) > 0 && entryDate

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4">
      <div className="space-y-2">
        <Label>Nama</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama penyewa"
        />
      </div>
      <div className="space-y-2">
        <Label>No. Telepon</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08xxxx"
        />
      </div>
      <div className="space-y-2">
        <Label>Jumlah Unit (maks {maxUnits})</Label>
        <Input
          type="number"
          min="1"
          max={maxUnits}
          value={rentedUnits}
          onChange={(e) => setRentedUnits(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Harga Sewa (Rp)</Label>
        <Input
          type="number"
          min="0"
          value={rentPrice}
          onChange={(e) => setRentPrice(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Tanggal Masuk</Label>
        <Input
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        disabled={!valid || loading}
        className="w-full bg-[var(--accent)] py-3 text-[15px] hover:bg-[var(--accent-pressed)]"
      >
        {loading ? 'Menyimpan...' : initial ? 'Simpan' : 'Tambah Penyewa'}
      </Button>
    </form>
  )
}
