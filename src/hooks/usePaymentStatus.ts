import { useMemo } from 'react'
import { nextDueDate, formatMonth } from '@/lib/date'
import type { Payment } from '@/types'

interface PaymentStatus {
  isLate: boolean
  nextDueMonth: string
  overdueMonths: string[]
}

export default function usePaymentStatus(
  entryDate: string,
  payments: Payment[]
): PaymentStatus {
  return useMemo(() => {
    const now = new Date()
    const currentMonth = formatMonth(now)
    const due = nextDueDate(entryDate)
    const dueMonth = formatMonth(due)

    // Build set of paid months
    const paidMonths = new Set(payments.map((p) => p.forMonth))

    // Check if current month is paid
    const isLate = currentMonth === dueMonth && !paidMonths.has(currentMonth)

    // Generate list of months since entry that are unpaid
    const entry = new Date(entryDate)
    const overdueMonths: string[] = []
    const cursor = new Date(entry.getFullYear(), entry.getMonth(), 1)
    const cutoff = new Date(now.getFullYear(), now.getMonth(), 1)

    while (cursor <= cutoff) {
      const ym = formatMonth(cursor)
      if (!paidMonths.has(ym)) {
        overdueMonths.push(ym)
      }
      cursor.setMonth(cursor.getMonth() + 1)
    }

    return { isLate, nextDueMonth: dueMonth, overdueMonths }
  }, [entryDate, payments])
}
