import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatMonth, nextDueDate } from '@/lib/date'
import { useState } from 'react'

const PAYMENT_METHODS = ['Cash', 'Transfer', 'QRIS', 'Lainnya']

interface PaymentSheetProps {
  open: boolean
  rentPrice: number
  entryDate: string
  defaultForMonth?: string
  onConfirm: (data: { amount: number; paymentMethod: string; forMonth: string }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function PaymentSheet({
  open,
  rentPrice,
  entryDate,
  defaultForMonth,
  onConfirm,
  onCancel,
  loading,
}: PaymentSheetProps) {
  const [method, setMethod] = useState(PAYMENT_METHODS[0])
  const dueMonth =
    defaultForMonth ?? formatMonth(nextDueDate(entryDate))
  const [forMonth, setForMonth] = useState(dueMonth)

  const handleSubmit = async () => {
    await onConfirm({
      amount: rentPrice,
      paymentMethod: method,
      forMonth,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) onCancel() }}>
      <DialogContent showCloseButton={false} className="max-w-[300px] p-5">
        <DialogHeader>
          <DialogTitle className="text-center text-[17px]">Catat Pembayaran</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Jumlah Bayar</Label>
            <div className="rounded-[10px] bg-[var(--bg)] px-[14px] py-3 text-[16px] text-[var(--fg-secondary)]">
              Rp {rentPrice.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Metode Bayar</Label>
            <Select value={method} onValueChange={(v) => v && setMethod(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Periode Bulan</Label>
            <Input
              type="month"
              value={forMonth}
              onChange={(e) => setForMonth(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[var(--green)] py-3 text-[15px] hover:bg-[var(--green)]"
          >
            {loading ? 'Menyimpan...' : 'Konfirmasi Bayar'}
          </Button>
          <DialogClose
            render={
              <Button variant="outline" className="w-full border-[var(--border)] py-3 text-[15px] text-[var(--accent)]" />
            }
          >
            Batal
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
