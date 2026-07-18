import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { NewProperty } from '@/types'

interface PropertyFormProps {
  initial?: NewProperty
  onSubmit: (data: NewProperty) => Promise<void>
  loading: boolean
}

export default function PropertyForm({ initial, onSubmit, loading }: PropertyFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [totalUnits, setTotalUnits] = useState(String(initial?.totalUnits ?? ''))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !location.trim() || !totalUnits) return
    await onSubmit({
      name: name.trim(),
      location: location.trim(),
      totalUnits: Number(totalUnits),
    })
  }

  const valid = name.trim() && location.trim() && Number(totalUnits) > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4">
      <div className="space-y-2">
        <Label>Nama Kontrakan</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Kontrakan Pak Joko"
        />
      </div>
      <div className="space-y-2">
        <Label>Lokasi</Label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Alamat kontrakan"
        />
      </div>
      <div className="space-y-2">
        <Label>Total Unit</Label>
        <Input
          type="number"
          min="1"
          value={totalUnits}
          onChange={(e) => setTotalUnits(e.target.value)}
          placeholder="Jumlah unit"
        />
      </div>
      <Button
        type="submit"
        disabled={!valid || loading}
        className="w-full bg-[var(--accent)] py-3 text-[15px] hover:bg-[var(--accent-pressed)]"
      >
        {loading ? 'Menyimpan...' : initial ? 'Simpan' : 'Tambah Kontrakan'}
      </Button>
    </form>
  )
}
