import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import type { PropertyWithVacant } from '@/stores/useProperties'

interface PropertyCardProps {
  property: PropertyWithVacant
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      size="sm"
      className="mx-4 mb-[10px] cursor-pointer bg-[var(--surface)] p-[14px_16px] active:opacity-70"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <h3 className="text-[17px] font-semibold text-[var(--fg)]">{property.name}</h3>
      <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">{property.location}</p>
      <div className="mt-2 flex items-center gap-2 text-[14px]">
        <span className="text-[var(--fg-secondary)]">
          Unit kosong: <strong className="text-[var(--green)] font-semibold">{property.vacantUnits}</strong>
        </span>
        <span className="text-[var(--fg-tertiary)]">/</span>
        <span className="text-[var(--fg-secondary)]">
          Total: <strong>{property.totalUnits}</strong>
        </span>
      </div>
    </Card>
  )
}
