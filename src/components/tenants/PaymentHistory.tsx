import { Button } from '@/components/ui/button'
import type { Payment } from '@/types'
import { monthLabel } from '@/lib/date'

interface PaymentHistoryProps {
  payments: Payment[]
  onEdit?: (payment: Payment) => void
  onDelete?: (payment: Payment) => void
}

export default function PaymentHistory({ payments, onEdit, onDelete }: PaymentHistoryProps) {
  if (payments.length === 0) {
    return <p className="px-4 py-5 text-center text-[14px] text-[var(--fg-tertiary)]">Belum ada pembayaran.</p>
  }

  return (
    <div className="space-y-2 px-4">
      {payments.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between rounded-[10px] bg-[var(--surface)] p-[12px_14px] text-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div>
            <p className="text-[15px] font-medium text-[var(--fg)]">{monthLabel(p.forMonth)}</p>
            <p className="text-[14px] text-[var(--fg-secondary)]">
              <span className="font-semibold text-[var(--green)]">Rp {p.amount.toLocaleString('id-ID')}</span> · {p.paymentMethod}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onEdit?.(p)} variant="ghost" size="xs" className="text-[var(--accent)]">
              Edit
            </Button>
            <Button onClick={() => onDelete?.(p)} variant="ghost" size="xs" className="text-[var(--red)]">
              Hapus
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
