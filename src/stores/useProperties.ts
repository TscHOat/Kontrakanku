import { create } from 'zustand'
import { eq, sum } from 'drizzle-orm'
import { getDB, persistDB } from '@/db'
import { properties, tenants, payments, maintenances } from '@/db/schema'
import type { Property, NewProperty } from '@/types'

export interface PropertyWithVacant extends Property {
  vacantUnits: number
}

interface PropertiesState {
  items: PropertyWithVacant[]
  loading: boolean
  error: string | null
  fetch: () => Promise<void>
  add: (data: NewProperty) => Promise<Property>
  update: (id: number, data: Partial<NewProperty>) => Promise<void>
  remove: (id: number) => Promise<void>
}

export default create<PropertiesState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null })
    try {
      const db = await getDB()
      const props = await db.select().from(properties).all()

      // Get rented units per property (active tenants only)
      const rented = await db
        .select({
          propertyId: tenants.propertyId,
          total: sum(tenants.rentedUnits),
        })
        .from(tenants)
        .where(eq(tenants.isActive, true))
        .groupBy(tenants.propertyId)
        .all()

      const rentedMap: Record<number, number> = {}
      for (const r of rented) {
        rentedMap[r.propertyId] = Number(r.total) || 0
      }

      const items: PropertyWithVacant[] = props.map((p) => ({
        ...p,
        vacantUnits: p.totalUnits - (rentedMap[p.id] || 0),
      }))

      set({ items, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  add: async (data: NewProperty) => {
    const db = await getDB()
    const [created] = await db.insert(properties).values(data).returning()
    await persistDB()
    await get().fetch()
    return created
  },

  update: async (id: number, data: Partial<NewProperty>) => {
    const db = await getDB()
    await db.update(properties).set(data).where(eq(properties.id, id))
    await persistDB()
    await get().fetch()
  },

  remove: async (id: number) => {
    const db = await getDB()
    // Cascade: delete payments → maintenances → tenants → property
    const propTenants = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(eq(tenants.propertyId, id))
      .all()
    const tIds = propTenants.map((t) => t.id)

    for (const tid of tIds) {
      await db.delete(payments).where(eq(payments.tenantId, tid))
    }
    await db.delete(maintenances).where(eq(maintenances.propertyId, id))
    await db.delete(tenants).where(eq(tenants.propertyId, id))
    await db.delete(properties).where(eq(properties.id, id))
    await persistDB()
    await get().fetch()
  },
}))
