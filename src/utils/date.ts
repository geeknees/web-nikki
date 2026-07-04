// ABOUTME: Shared date formatting helpers for post metadata display.
// ABOUTME: Keeps date presentation consistent across list and taxonomy summaries.

export function formatDate(date?: Date) {
  if (!date) return '--'

  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}
