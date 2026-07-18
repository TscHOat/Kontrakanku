import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { eq } from 'drizzle-orm'
import { getDB } from '@/db'
import { properties, payments } from '@/db/schema'
import useProperties from '@/stores/useProperties'
import type { PropertyWithVacant } from '@/stores/useProperties'
import useTenants from '@/stores/useTenants'
import useMaintenances from '@/stores/useMaintenances'
import TenantCard from '@/components/tenants/TenantCard'
import EmptyState from '@/components/ui/EmptyState'
import ErrorNotice from '@/components/ui/ErrorNotice'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import MaintenanceForm from '@/components/maintenances/MaintenanceForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { monthLabel } from '@/lib/date'
import type { Maintenance, NewMaintenance } from '@/types'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const propertyId = Number(id)

  const { items: storeItems, remove, fetch: fetchProperties } = useProperties()
  const { items: tenantList, loading, error, fetch: fetchTenants } = useTenants()
  const [property, setProperty] = useState<PropertyWithVacant | null>(null)
  const [search, setSearch] = useState('')
  const [paidMonths, setPaidMonths] = useState<Set<string>>(new Set())
  const [showDelete, setShowDelete] = useState(false)
  const [showMForm, setShowMForm] = useState(false)
  const [editM, setEditM] = useState<Maintenance | null>(null)
  const [mFilter, setMFilter] = useState<'all' | 'pending' | 'done'>('all')
  const {
    items: maintList,
    loading: mLoading,
    error: mError,
    fetchByProperty: fetchMaintenances,
    add: addM,
    update: updateM,
    remove: removeM,
    toggleStatus: toggleMStatus,
  } = useMaintenances()
  const [mSaving, setMSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      // ensure properties loaded for vacant count
      if (storeItems.length === 0) await fetchProperties()
      const found = storeItems.find((p) => p.id === propertyId)
      if (found) {
        setProperty(found)
      } else {
        // direct fetch if not in store
        const db = await getDB()
        const [row] = await db
          .select()
          .from(properties)
          .where(eq(properties.id, propertyId))
          .all()
        if (row) {
          setProperty({ ...row, vacantUnits: row.totalUnits })
        } else {
          setProperty(null)
        }
      }
    })()
  }, [propertyId])

  useEffect(() => {
    fetchTenants(propertyId)
  }, [propertyId])

  useEffect(() => {
    if (property) fetchMaintenances(propertyId)
  }, [property])

  // fetch payment status for all tenants in this property
  useEffect(() => {
    ;(async () => {
      if (tenantList.length === 0) return
      const db = await getDB()
      const tIds = tenantList.map((t) => t.id)
      const rows = await db
        .select({ forMonth: payments.forMonth, tenantId: payments.tenantId })
        .from(payments)
        .all()
      const paid = new Set<string>()
      for (const r of rows) {
        if (tIds.includes(r.tenantId)) {
          paid.add(`${r.tenantId}-${r.forMonth}`)
        }
      }
      setPaidMonths(paid)
    })()
  }, [tenantList])

  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

  const filtered = tenantList.filter(
    (t) =>
      (t.isActive !== false) &&
      t.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    await remove(propertyId)
    navigate('/')
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--separator)] border-t-[var(--accent)]" />
      </div>
    )
  }

  return (
    <div>
      {/* Property header — PropHeaderCard style */}
      <div className="mx-4 mb-[10px] mt-2 rounded-[12px] bg-[var(--surface)] p-[14px_16px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-[20px] font-bold text-[var(--fg)]">{property.name}</h2>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">{property.location}</p>
        <p className="mt-1 text-[14px] text-[var(--fg-secondary)]">
          Unit kosong:{' '}
          <span className="font-semibold text-[var(--green)]">{property.vacantUnits} unit</span>
        </p>
        <div className="mt-3 flex gap-[10px]">
          <Button
            onClick={() => navigate(`/property/${propertyId}/edit`)}
            className="flex-1 bg-[var(--accent)] py-[10px] text-[15px] hover:bg-[var(--accent-pressed)]"
          >
            Edit
          </Button>
          <Button
            onClick={() => setShowDelete(true)}
            variant="outline"
            className="flex-1 border-[0.5px] border-[var(--red)] py-[10px] text-[15px] text-[var(--red)] hover:bg-transparent"
          >
            Hapus
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari penyewa..."
        />
      </div>

      {/* Tenants section */}
      <div className="section-head">Penyewa Aktif</div>

      {loading && (
        <div className="space-y-2 px-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-[12px] bg-[var(--separator)]" />
          ))}
        </div>
      )}
      {error && <ErrorNotice message={error} onRetry={() => fetchTenants(propertyId)} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          message="Belum ada penyewa aktif."
          actionLabel="Tambah Penyewa"
          onAction={() => navigate(`/property/${propertyId}/tenant/new`)}
        />
      )}

      {!loading &&
        filtered.map((t) => (
          <TenantCard
            key={t.id}
            tenant={t}
            paidMonths={new Set(
              Array.from(paidMonths).filter((pm) => pm.startsWith(`${t.id}-`))
            )}
            currentMonth={currentMonth}
          />
        ))}

      {/* Perbaikan section */}
      <div className="mt-2 px-4">
        <div className="section-head !pl-0">Perbaikan</div>

        {/* Filter tabs — segmented style */}
        <div className="mb-3 flex gap-2">
          {(['all', 'pending', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setMFilter(f)}
              className={`rounded-[10px] px-3 py-1.5 text-[13px] font-medium ${
                mFilter === f
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--surface)] text-[var(--fg-secondary)] border-[0.5px] border-[var(--border)]'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'pending' ? 'Pending' : 'Selesai'}
            </button>
          ))}
          <button
            onClick={() => { setEditM(null); setShowMForm(true) }}
            className="ml-auto rounded-[10px] bg-[var(--accent)] px-3 py-1.5 text-[13px] font-medium text-white"
          >
            + Baru
          </button>
        </div>

        {mLoading && (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        )}
        {mError && <ErrorNotice message={mError} onRetry={() => fetchMaintenances(propertyId)} />}

        {!mLoading && !mError && (
          <>
            {maintList.filter((m) => mFilter === 'all' || m.status === mFilter).length === 0 ? (
              <p className="py-5 text-center text-[14px] text-[var(--fg-tertiary)]">
                {mFilter === 'all' ? 'Belum ada catatan perbaikan.' : 'Tidak ada perbaikan dengan status ini.'}
              </p>
            ) : (
              <div className="space-y-2">
                {maintList
                  .filter((m) => mFilter === 'all' || m.status === mFilter)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-[10px] bg-[var(--surface)] p-[12px_14px] text-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[15px] font-medium text-[var(--fg)]">{m.title}</p>
                          <span
                            className={`rounded-full px-[10px] py-[3px] text-[12px] font-medium ${
                              m.status === 'done'
                                ? 'bg-[var(--green-bg)] text-[var(--green-text)]'
                                : 'bg-[rgba(255,149,0,0.15)] text-[var(--orange)]'
                            }`}
                          >
                            {m.status === 'done' ? 'Selesai' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-[14px] text-[var(--fg-secondary)]">
                          {monthLabel(m.date.slice(0, 7))} · Rp {m.cost.toLocaleString('id-ID')}
                        </p>
                        {m.description && (
                          <p className="mt-0.5 text-[13px] text-[var(--fg-tertiary)]">{m.description}</p>
                        )}
                      </div>
                      <div className="ml-2 flex flex-col items-end gap-1">
                        <Button
                          onClick={() => toggleMStatus(m.id)}
                          variant="ghost"
                          size="xs"
                          className={`h-auto px-1 text-[13px] ${
                            m.status === 'done' ? 'text-[var(--orange)]' : 'text-[var(--green)]'
                          }`}
                        >
                          {m.status === 'done' ? 'Pending' : 'Selesai'}
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => { setEditM(m); setShowMForm(true) }}
                            variant="ghost"
                            size="xs"
                            className="h-auto px-1 text-[13px] text-[var(--accent)]"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={async () => {
                              if (confirm('Hapus perbaikan ini?')) await removeM(m.id)
                            }}
                            variant="ghost"
                            size="xs"
                            className="h-auto px-1 text-[13px] text-[var(--red)]"
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      {showMForm && (
        <MaintenanceForm
          propertyId={propertyId}
          initial={editM ? { ...editM, propertyId } : undefined}
          onSubmit={async (data: NewMaintenance) => {
            setMSaving(true)
            try {
              if (editM) {
                await updateM(editM.id, data)
              } else {
                await addM(data)
              }
              setShowMForm(false)
              setEditM(null)
            } catch (e) {
              alert((e as Error).message)
            } finally {
              setMSaving(false)
            }
          }}
          onCancel={() => { setShowMForm(false); setEditM(null) }}
          loading={mSaving}
        />
      )}

      {/* FAB */}
      <button
        onClick={() => navigate(`/property/${propertyId}/tenant/new`)}
        className="fixed bottom-20 right-4 z-[50] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-2xl text-white shadow-[0_4px_12px_rgba(0,122,255,0.3)] active:scale-95"
        aria-label="Tambah penyewa"
      >
        +
      </button>

      <ConfirmDialog
        open={showDelete}
        title="Hapus Kontrakan?"
        message={`Semua data penyewa, pembayaran, dan perbaikan di "${property.name}" akan dihapus.`}
        confirmText="Hapus"
        cancelText="Batal"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}
