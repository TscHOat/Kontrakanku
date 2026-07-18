import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import useTenants from '@/stores/useTenants'
import useProperties from '@/stores/useProperties'
import TenantForm from '@/components/tenants/TenantForm'
import type { NewTenant } from '@/types'

export default function TenantFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { items: tenants, add, update, fetch: fetchTenants } = useTenants()
  const { items: properties, fetch: fetchProperties } = useProperties()
  const [loading, setLoading] = useState(false)

  // Determine mode: create or edit
  const isCreate = location.pathname.includes('/tenant/new')
  const propertyId = isCreate ? Number(id) : undefined
  const tenantId = isCreate ? undefined : Number(id)

  const existing = tenantId ? tenants.find((t) => t.id === tenantId) : undefined
  const propId = existing?.propertyId ?? propertyId!

  // Load data if needed
  useEffect(() => {
    if (properties.length === 0) fetchProperties()
    if (existing) fetchTenants(existing.propertyId)
  }, [])

  const property = properties.find((p) => p.id === propId)
  const maxUnits = property ? property.vacantUnits : 0
  const initial: Partial<NewTenant> | undefined = existing
    ? {
      name: existing.name,
      phone: existing.phone,
      rentedUnits: existing.rentedUnits,
      rentPrice: existing.rentPrice,
      entryDate: existing.entryDate,
    }
    : undefined

  const handleSubmit = async (data: NewTenant) => {
    setLoading(true)
    try {
      if (existing) {
        await update(existing.id, data)
      } else {
        await add(data)
      }
      navigate(`/property/${propId}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="px-4 pt-1 text-[17px] font-semibold text-[var(--fg)]">
        {existing ? 'Edit Penyewa' : 'Tambah Penyewa'}
      </h2>
      <TenantForm
        initial={initial}
        propertyId={propId}
        maxUnits={maxUnits}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}
