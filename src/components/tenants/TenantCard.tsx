import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Tenant } from '@/types'

interface TenantCardProps {
  tenant: Tenant
  paidMonths: Set<string>
  currentMonth: string
}

export default function TenantCard({ tenant, paidMonths, currentMonth }: TenantCardProps) {
  const navigate = useNavigate()
  const isPaid = paidMonths.has(currentMonth)

  return (
    <Card
      size="sm"
      className="mx-4 mb-[8px] cursor-pointer bg-[var(--surface)] p-[14px_16px] active:opacity-70"
      onClick={() => navigate(`/tenant/${tenant.id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-[16px] font-semibold text-[var(--fg)]">{tenant.name}</h3>
          <p className="text-[14px] text-[var(--fg-secondary)]">
            {tenant.rentedUnits} unit · Rp {tenant.rentPrice.toLocaleString('id-ID')}
          </p>
        </div>
        <Badge
          variant={isPaid ? 'default' : 'destructive'}
          className={`rounded-full px-[10px] py-[3px] text-[12px] ${
            isPaid ? 'bg-[var(--green-bg)] text-[var(--green-text)] hover:bg-[var(--green-bg)]' : ''
          }`}
        >
          {isPaid ? 'Lunas' : 'Belum'}
        </Badge>
      </div>
    </Card>
  )
}
