import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { eq } from 'drizzle-orm'
import { getDB, persistDB } from '@/db'
import { tenants as tenantsSchema } from '@/db/schema'
import usePayments from '@/stores/usePayments'
import PaymentHistory from '@/components/tenants/PaymentHistory'
import PaymentSheet from '@/components/payments/PaymentSheet'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/button'
import type { Payment, Tenant } from '@/types'
import { nextDueDate, formatMonth, formatDate } from '@/lib/date'

export default function TenantDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const tenantId = Number(id)

  const {
    items: payments,
    loading: paymentsLoading,
    fetchByTenant,
    add: addPayment,
    update: updatePayment,
    remove: removePayment,
  } = usePayments()

  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [showPay, setShowPay] = useState(false)
  const [editPayment, setEditPayment] = useState<Payment | null>(null)
  const [payLoading, setPayLoading] = useState(false)
  const [showDeactivate, setShowDeactivate] = useState(false)
  const [deletePayment, setDeletePayment] = useState<Payment | null>(null)

  useEffect(() => {
    ;(async () => {
      const db = await getDB()
      const [t] = await db
        .select()
        .from(tenantsSchema)
        .where(eq(tenantsSchema.id, tenantId))
        .all()
      if (t) setTenant(t as unknown as Tenant)
    })()
    fetchByTenant(tenantId)
  }, [tenantId, fetchByTenant])

  const handlePayConfirm = async (data: {
    amount: number
    paymentMethod: string
    forMonth: string
  }) => {
    if (!tenant) return
    setPayLoading(true)
    try {
      if (editPayment) {
        await updatePayment(editPayment.id, {
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          forMonth: data.forMonth,
        })
      } else {
        await addPayment({
          tenantId: tenant.id,
          amount: data.amount,
          paymentDate: formatDate(new Date()),
          paymentMethod: data.paymentMethod,
          forMonth: data.forMonth,
        })
      }
      await persistDB()
      setShowPay(false)
      setEditPayment(null)
      fetchByTenant(tenantId)
    } finally {
      setPayLoading(false)
    }
  }

  const handleEditPayment = (p: Payment) => {
    setEditPayment(p)
    setShowPay(true)
  }

  const handleDeletePayment = async () => {
    if (!deletePayment) return
    await removePayment(deletePayment.id)
    await persistDB()
    setDeletePayment(null)
    fetchByTenant(tenantId)
  }

  const handleDeactivate = async () => {
    const db = await getDB()
    await db
      .update(tenantsSchema)
      .set({ isActive: false })
      .where(eq(tenantsSchema.id, tenantId))
    await persistDB()
    if (tenant) {
      navigate(`/property/${tenant.propertyId}`)
    } else {
      navigate('/')
    }
  }

  const defaultForMonth = tenant ? formatMonth(nextDueDate(tenant.entryDate)) : undefined

  if (!tenant) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--separator)] border-t-[var(--accent)]" />
      </div>
    )
  }

  return (
    <div>
      {/* Tenant info card */}
      <div className="mx-4 mb-[10px] mt-2 rounded-[12px] bg-[var(--surface)] p-[14px_16px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-[20px] font-bold text-[var(--fg)]">{tenant.name}</h2>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">{tenant.phone}</p>
        <div className="mt-2 space-y-1 text-[14px] text-[var(--fg-secondary)]">
          <p>Unit: {tenant.rentedUnits}</p>
          <p>Harga Sewa: Rp {tenant.rentPrice.toLocaleString('id-ID')}</p>
          <p>Masuk: {tenant.entryDate}</p>
        </div>
        <div className="mt-3 flex gap-[10px]">
          <Button
            onClick={() => navigate(`/tenant/${tenantId}/edit`)}
            className="flex-1 bg-[var(--accent)] py-[10px] text-[15px] hover:bg-[var(--accent-pressed)]"
          >
            Edit
          </Button>
          <Button
            onClick={() => setShowDeactivate(true)}
            variant="outline"
            className="flex-1 border-[0.5px] border-[var(--red)] py-[10px] text-[15px] text-[var(--red)] hover:bg-transparent"
          >
            Nonaktifkan
          </Button>
        </div>
      </div>

      {/* Payment history section */}
      <div className="section-head">Riwayat Pembayaran</div>
      {paymentsLoading && (
        <div className="space-y-2 px-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-[12px] bg-[var(--separator)]" />
          ))}
        </div>
      )}
      <PaymentHistory
        payments={payments}
        onEdit={handleEditPayment}
        onDelete={(p) => setDeletePayment(p)}
      />

      {/* Pay button */}
      <div className="px-4 pb-8">
        <Button
          onClick={() => {
            setEditPayment(null)
            setShowPay(true)
          }}
          className="mt-2 w-full bg-[var(--green)] py-3 text-[15px] hover:bg-[var(--green)]"
        >
          Tandai Sudah Bayar
        </Button>
      </div>

      <PaymentSheet
        open={showPay}
        rentPrice={editPayment?.amount ?? tenant.rentPrice}
        entryDate={tenant.entryDate}
        defaultForMonth={editPayment?.forMonth ?? defaultForMonth}
        onConfirm={handlePayConfirm}
        onCancel={() => {
          setShowPay(false)
          setEditPayment(null)
        }}
        loading={payLoading}
      />

      <ConfirmDialog
        open={showDeactivate}
        title="Nonaktifkan Penyewa?"
        message={`${tenant.name} akan dinonaktifkan. Data pembayaran tetap tersimpan.`}
        confirmText="Nonaktifkan"
        cancelText="Batal"
        destructive
        onConfirm={handleDeactivate}
        onCancel={() => setShowDeactivate(false)}
      />

      <ConfirmDialog
        open={!!deletePayment}
        title="Hapus Pembayaran?"
        message="Pembayaran ini akan dihapus."
        confirmText="Hapus"
        cancelText="Batal"
        destructive
        onConfirm={handleDeletePayment}
        onCancel={() => setDeletePayment(null)}
      />
    </div>
  )
}
