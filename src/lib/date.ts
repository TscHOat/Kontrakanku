/**
 * nextDueDate(entryDate: string): Date
 * Returns the next due date based on entry_date day-of-month.
 * If today is past the due day, returns next month's due date.
 */
export function nextDueDate(entryDate: string): Date {
  const now = new Date()
  const entry = new Date(entryDate)
  const dueDay = entry.getDate()

  // Build this month's due date
  const thisDue = new Date(now.getFullYear(), now.getMonth(), dueDay)
  // If due day overflows (e.g. Feb 31), clamp to month end
  if (thisDue.getDate() !== dueDay) {
    thisDue.setDate(0) // last day of previous month = end of intended month
  }

  if (now >= thisDue) {
    // Next month
    const nextDue = new Date(now.getFullYear(), now.getMonth() + 1, dueDay)
    if (nextDue.getDate() !== dueDay) {
      nextDue.setDate(0)
    }
    return nextDue
  }
  return thisDue
}

/**
 * dueDateFallback(day: number, month: number, year: number): Date
 * Returns a Date for (year, month, day), clamping to month end if day overflows.
 */
export function dueDateFallback(year: number, month: number, day: number): Date {
  const d = new Date(year, month, day)
  if (d.getDate() !== day) {
    d.setDate(0)
  }
  return d
}

/**
 * Format a Date to YYYY-MM-DD string.
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Format a Date to YYYY-MM string.
 */
export function formatMonth(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

/**
 * Get display name for a YYYY-MM month string (e.g. "Jan 2025").
 */
export function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ]
  return `${months[m - 1]} ${y}`
}
