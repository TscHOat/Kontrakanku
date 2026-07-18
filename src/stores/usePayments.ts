import { create } from 'zustand'
import { eq, desc } from 'drizzle-orm'
import { getDB, persistDB } from '@/db'
import { payments } from '@/db/schema'
import type { Payment, NewPayment } from '@/types'

interface PaymentsState {
  items: Payment[]
  loading: boolean
  error: string | null
  fetchByTenant: (tenantId: number) => Promise<void>
  add: (data: NewPayment) => Promise<Payment>
  update: (id: number, data: Partial<NewPayment>) => Promise<void>
  remove: (id: number) => Promise<void>
}

export default create<PaymentsState>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchByTenant: async (tenantId: number) => {
    set({ loading: true, error: null })
    try {
      const db = await getDB()
      const items = await db
        .select()
        .from(payments)
        .where(eq(payments.tenantId, tenantId))
        .orderBy(desc(payments.forMonth))
        .all()
      set({ items, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  add: async (data: NewPayment) => {
    const db = await getDB()
    const [created] = await db.insert(payments).values(data).returning()
    await persistDB()
    return created
  },

  update: async (id: number, data: Partial<NewPayment>) => {
    const db = await getDB()
    await db.update(payments).set(data).where(eq(payments.id, id))
    await persistDB()
  },

  remove: async (id: number) => {
    const db = await getDB()
    await db.delete(payments).where(eq(payments.id, id))
    await persistDB()
  },
}))
