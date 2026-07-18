import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import type { NewMaintenance } from '@/types'

interface MaintenanceFormProps {
  initial?: Partial<NewMaintenance>
  propertyId: number
  onSubmit: (data: NewMaintenance) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export default function MaintenanceForm({
  initial,
  propertyId,
  onSubmit,
  onCancel,
  loading,
}: MaintenanceFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [cost, setCost] = useState(String(initial?.cost ?? ''))
  const [date, setDate] = useState(initial?.date ?? '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !cost || !date) return
    await onSubmit({
      propertyId,
      title: title.trim(),
      description: description.trim() || null,
      cost: Number(cost),
      date,
      status: initial?.status ?? 'pending',
    })
  }

  const valid = title.trim() && Number(cost) > 0 && date

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onCancel() }}>
      <DialogContent showCloseButton={false} className="max-w-[300px] p-5">
        <DialogHeader>
          <DialogTitle className="text-center text-[17px]">
            {initial ? 'Edit Perbaikan' : 'Tambah Perbaikan'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Judul</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul perbaikan"
            />
          </div>
          <div className="space-y-2">
            <Label>Detail (opsional)</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi..."
              rows={3}
              className="w-full rounded-[10px] border-[0.5px] border-[var(--border)] bg-[var(--surface)] px-[14px] py-3 text-[16px] text-[var(--fg)] placeholder:text-[var(--fg-tertiary)] focus:border-[var(--accent)] focus:shadow-[0_0_0_2px_rgba(0,122,255,0.15)] focus:outline-none resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>Biaya (Rp)</Label>
            <Input
              type="number"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="submit"
              disabled={!valid || loading}
              className="w-full bg-[var(--accent)] py-3 text-[15px] hover:bg-[var(--accent-pressed)]"
            >
              {loading ? 'Menyimpan...' : initial ? 'Simpan' : 'Tambah'}
            </Button>
            <DialogClose
              render={
                <Button variant="outline" className="w-full border-[var(--border)] py-3 text-[15px] text-[var(--accent)]" />
              }
            >
              Batal
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
