import type { Project, Domain, Blocker, User, Task, DailyUpdate } from '../types'
import { isDeveloper } from './permissions'
import { hasSubmittedToday } from './reminderEngine'

export interface ChatbotContext {
  projects: Project[]
  domains: Domain[]
  blockers: Blocker[]
  users: User[]
  tasks: Task[]
  dailyUpdates: DailyUpdate[]
  currentUser: User
}

const HELP_TEXT = "I can answer questions like:\n• \"portfolio summary\"\n• \"status of <project name>\"\n• \"blockers\" or \"critical blockers\"\n• \"domain summary\"\n• \"my pending tasks\"\n\nI can also take action for you — type \"help\" to see what's available to your role.\n\nWhat would you like to know?"

function fuzzyFindProject(query: string, projects: Project[]): Project | undefined {
  const q = query.toLowerCase()
  return projects.find((p) => q.includes(p.name.toLowerCase()) || q.includes(p.projectId.toLowerCase()))
    ?? projects.find((p) => p.name.toLowerCase().split(' ').some((word) => word.length > 3 && q.includes(word)))
}

function describeProject(p: Project, blockers: Blocker[]): string {
  const openBlockers = blockers.filter((b) => b.projectId === p.id && b.status !== 'Resolved' && b.status !== 'Closed')
  const lines = [
    `${p.name} (${p.projectId})`,
    `Status: ${p.status} · Health: ${p.healthIndicator} · Completion: ${p.completionPercentage}%`,
    `PM: ${p.projectManager} · Domain: ${p.domainName}`,
  ]
  if (openBlockers.length) {
    lines.push(`Open blockers: ${openBlockers.map((b) => `${b.severity} — ${b.description}`).join('; ')}`)
  } else {
    lines.push('No open blockers.')
  }
  return lines.join('\n')
}

function portfolioSummary(ctx: ChatbotContext): string {
  const { projects } = ctx
  const onTrack = projects.filter((p) => p.status === 'On Track').length
  const delayed = projects.filter((p) => p.status === 'Delayed').length
  const breached = projects.filter((p) => p.status === 'Breached').length
  return `Portfolio: ${projects.length} projects — ${onTrack} On Track, ${delayed} Delayed, ${breached} Breached.`
}

function blockersOverview(ctx: ChatbotContext): string {
  const open = ctx.blockers.filter((b) => b.status !== 'Resolved' && b.status !== 'Closed')
  const critical = open.filter((b) => b.severity === 'Critical')
  if (open.length === 0) return 'No open blockers across the portfolio.'
  const list = open.slice(0, 6).map((b) => `• [${b.severity}] ${b.projectName}: ${b.description}`).join('\n')
  return `${open.length} open blockers (${critical.length} critical):\n${list}`
}

function domainSummary(ctx: ChatbotContext): string {
  return ctx.domains.map((d) => `${d.name}: ${d.projectCount} projects (owner: ${d.owner})`).join('\n')
}

function myPendingTasks(ctx: ChatbotContext): string {
  if (!isDeveloper(ctx.currentUser)) return "That question is only meaningful for a Developer's own login."
  const myTasks = ctx.tasks.filter((t) => t.assignedToId === ctx.currentUser.id && t.status !== 'Completed')
  const submitted = hasSubmittedToday(ctx.currentUser.id, ctx.dailyUpdates)
  const taskLines = myTasks.length
    ? myTasks.map((t) => `• [${t.status}] ${t.title}`).join('\n')
    : 'No open tasks assigned to you.'
  return `${taskLines}\n\nToday's update: ${submitted ? 'already submitted.' : 'not submitted yet.'}`
}

export function answerQuery(query: string, ctx: ChatbotContext): string {
  const q = query.trim().toLowerCase()

  if (!q) return HELP_TEXT
  if (/^(hi|hello|hey)\b/.test(q) || q === 'help') return `Hi ${ctx.currentUser.name}! ${HELP_TEXT}`
  if (/portfolio|overall|summary of (all|everything)/.test(q)) return portfolioSummary(ctx)
  if (/blocker/.test(q)) return blockersOverview(ctx)
  if (/domain/.test(q)) return domainSummary(ctx)
  if (/my (pending )?task|my update/.test(q)) return myPendingTasks(ctx)

  const project = fuzzyFindProject(q, ctx.projects)
  if (project) return describeProject(project, ctx.blockers)

  if (/status/.test(q)) return portfolioSummary(ctx)

  return `I didn't quite catch that.\n\n${HELP_TEXT}`
}
