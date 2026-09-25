import type { User, DailyUpdate } from '../types'

export function todayStr(now: Date = new Date()): string {
  return now.toISOString().split('T')[0]
}

export function hasSubmittedToday(developerId: string, updates: DailyUpdate[], now: Date = new Date()): boolean {
  const today = todayStr(now)
  return updates.some((u) => u.developerId === developerId && u.date === today)
}

export function getMissingDevelopersToday(developers: User[], updates: DailyUpdate[], now: Date = new Date()): User[] {
  return developers.filter((d) => d.isActive !== false && !hasSubmittedToday(d.id, updates, now))
}

export function isPastReminderTime(now: Date = new Date()): boolean {
  return now.getHours() >= 18
}

export function buildReminderMailto(developer: User, projectNames: string[]): string {
  const subject = encodeURIComponent("Reminder: today's daily update is pending")
  const projectLine = projectNames.length ? ` on ${projectNames.join(', ')}` : ''
  const body = encodeURIComponent(`Hi ${developer.name},\n\nYou haven't submitted your daily task update${projectLine} yet today. Please fill it in when you get a chance.\n\nThanks!`)
  return `mailto:${developer.email}?subject=${subject}&body=${body}`
}

export function buildBulkReminderMailto(developers: User[]): string {
  const subject = encodeURIComponent("Reminder: today's daily update is pending")
  const body = encodeURIComponent(`Hi all,\n\nA friendly reminder to submit your daily task update for today.\n\nThanks!`)
  const bcc = developers.map((d) => d.email).join(',')
  return `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`
}

export function sendReminderEmails(developers: User[]): void {
  if (developers.length === 0) return
  window.location.href = developers.length === 1
    ? buildReminderMailto(developers[0], [])
    : buildBulkReminderMailto(developers)
}
