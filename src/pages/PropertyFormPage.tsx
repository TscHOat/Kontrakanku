import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useProperties from '@/stores/useProperties'
import PropertyForm from '@/components/properties/PropertyForm'
import type { NewProperty } from '@/types'

export default function PropertyFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items, add, update } = useProperties()
  const [loading, setLoading] = useState(false)

  const isEdit = !!id
  const existing = isEdit ? items.find((p) => p.id === Number(id)) : undefined

  const initial: NewProperty | undefined = existing
    ? { name: existing.name, location: existing.location, totalUnits: existing.totalUnits }
    : undefined

  const handleSubmit = async (data: NewProperty) => {
    setLoading(true)
    try {
      if (isEdit) {
        await update(Number(id), data)
      } else {
        await add(data)
      }
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="px-4 pt-1 text-[17px] font-semibold text-[var(--fg)]">
        {isEdit ? 'Edit Kontrakan' : 'Tambah Kontrakan'}
      </h2>
      <PropertyForm initial={initial} onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
