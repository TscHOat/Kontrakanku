import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useProperties from '@/stores/useProperties'
import PropertyCard from '@/components/properties/PropertyCard'
import EmptyState from '@/components/ui/EmptyState'
import ErrorNotice from '@/components/ui/ErrorNotice'
import { PlusIcon } from 'lucide-react'
import { Button } from '@base-ui/react'

export default function PropertiesPage() {
  const { items, loading, error, fetch } = useProperties()
  const navigate = useNavigate()

  useEffect(() => {
    fetch()
  }, [fetch])

  if (loading && items.length === 0) {
    return (
      <div className="space-y-[10px] px-4 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-[12px] bg-[var(--separator)]" />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorNotice message={error} onRetry={fetch} />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message="Belum ada kontrakan."
        actionLabel="Tambah Kontrakan Pertama"
        onAction={() => navigate('/property/new')}
      />
    )
  }

  return (
    <div>
      <div className="pt-4">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      {/* FAB */}
      <Button
        onClick={() => navigate('/property/new')}
        className="fixed bottom-20 right-4 z-[50] rounded-full h-14 w-14 bg-[var(--accent)] text-2xl text-white shadow-[0_4px_12px_rgba(0,122,255,0.3)] active:scale-95 flex items-center justify-center hover:bg-[var(--accent-pressed)]"
        aria-label="Tambah kontrakan"
      >
        <PlusIcon />
      </Button>
    </div>
  )
}
