import { create } from 'zustand'
import { eq } from 'drizzle-orm'
import { getDB, persistDB } from '@/db'
import { tenants } from '@/db/schema'
import type { Tenant, NewTenant } from '@/types'

export interface TenantWithStatus extends Tenant {
  // payment status filled at page level
}

interface TenantsState {
  items: Tenant[]
  loading: boolean
  error: string | null
  fetch: (propertyId: number) => Promise<void>
  add: (data: NewTenant) => Promise<Tenant>
  update: (id: number, data: Partial<NewTenant>) => Promise<void>
  remove: (id: number) => Promise<void>
  deactivate: (id: number) => Promise<void>
}

export default create<TenantsState>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async (propertyId: number) => {
    set({ loading: true, error: null })
    try {
      const db = await getDB()
      const items = await db
        .select()
        .from(tenants)
        .where(eq(tenants.propertyId, propertyId))
        .all()
      set({ items, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  add: async (data: NewTenant) => {
    const db = await getDB()
    const [created] = await db.insert(tenants).values(data).returning()
    await persistDB()
    return created
  },

  update: async (id: number, data: Partial<NewTenant>) => {
    const db = await getDB()
    await db.update(tenants).set(data).where(eq(tenants.id, id))
    await persistDB()
  },

  remove: async (id: number) => {
    const db = await getDB()
    await db.delete(tenants).where(eq(tenants.id, id))
    await persistDB()
  },

  deactivate: async (id: number) => {
    const db = await getDB()
    await db.update(tenants).set({ isActive: false }).where(eq(tenants.id, id))
    await persistDB()
  },
}))
