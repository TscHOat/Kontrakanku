import { create } from 'zustand'
import { eq, desc } from 'drizzle-orm'
import { getDB } from '@/db'
import { maintenances } from '@/db/schema'
import type { Maintenance, NewMaintenance } from '@/types'

interface MaintenancesState {
  items: Maintenance[]
  loading: boolean
  error: string | null
  fetchByProperty: (propertyId: number) => Promise<void>
  add: (data: NewMaintenance) => Promise<void>
  update: (id: number, data: Partial<NewMaintenance>) => Promise<void>
  remove: (id: number) => Promise<void>
  toggleStatus: (id: number) => Promise<void>
}

export default create<MaintenancesState>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchByProperty: async (propertyId: number) => {
    set({ loading: true, error: null })
    try {
      const db = await getDB()
      const items = await db
        .select()
        .from(maintenances)
        .where(eq(maintenances.propertyId, propertyId))
        .orderBy(desc(maintenances.date))
        .all()
      set({ items, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  add: async (data: NewMaintenance) => {
    await getDB().then(db => db.insert(maintenances).values(data))
    // refresh items
    const db = await getDB()
    const items = await db
      .select()
      .from(maintenances)
      .where(eq(maintenances.propertyId, data.propertyId))
      .orderBy(desc(maintenances.date))
      .all()
    set({ items })
  },

  update: async (id: number, data: Partial<NewMaintenance>) => {
    const db = await getDB()
    await db.update(maintenances).set(data).where(eq(maintenances.id, id))
    const updated = await db.select().from(maintenances).where(eq(maintenances.id, id)).get()
    if (updated) {
      set((state) => ({
        items: state.items.map((m) => (m.id === id ? updated : m)),
      }))
    }
  },

  remove: async (id: number) => {
    const db = await getDB()
    await db.delete(maintenances).where(eq(maintenances.id, id))
    set((state) => ({ items: state.items.filter((m) => m.id !== id) }))
  },

  toggleStatus: async (id: number) => {
    const db = await getDB()
    const [row] = await db.select().from(maintenances).where(eq(maintenances.id, id)).all()
    if (!row) return
    const newStatus = row.status === 'pending' ? 'done' : 'pending'
    await db.update(maintenances).set({ status: newStatus }).where(eq(maintenances.id, id))
    set((state) => ({
      items: state.items.map((m) => (m.id === id ? { ...m, status: newStatus } : m)),
    }))
  },
}))
