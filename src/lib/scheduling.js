const HOURS_BY_WEEKDAY = {
  0: null,
  1: { open: 10, close: 16 },
  2: { open: 10, close: 18 },
  3: { open: 10, close: 18 },
  4: { open: 10, close: 18 },
  5: { open: 10, close: 18 },
  6: { open: 10, close: 16 },
}

export function getMinScheduleDate() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().slice(0, 10)
}

export function getHoursForDate(dateStr) {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  const weekday = new Date(year, month - 1, day).getDay()
  return HOURS_BY_WEEKDAY[weekday]
}

export function generateTimeSlots(dateStr) {
  const hours = getHoursForDate(dateStr)
  if (!hours) return []
  const slots = []
  for (let hour = hours.open; hour < hours.close; hour += 1) {
    slots.push(`${String(hour).padStart(2, '0')}:00`)
  }
  return slots
}
