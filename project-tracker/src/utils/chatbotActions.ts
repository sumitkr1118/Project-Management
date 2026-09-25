import type { User, Project, TaskUpdateEntry, ProjectStatus, TaskStatus } from '../types'
import { isManager, isTeamLead, isDeveloper } from './permissions'
import { todayStr } from './reminderEngine'
import {
  type FieldSpec, type FieldContext, fuzzyFind,
  textField, optionalTextField, emailField, dateField, enumField, percentField,
  domainField, teamLeadField, editableProjectField, myTaskField,
} from './chatbotFields'

export interface ActionContext extends FieldContext {
  addUser: (u: Omit<User, 'id'>) => void
  addProject: (p: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  submitDailyUpdate: (developerId: string, date: string, entries: TaskUpdateEntry[], overallNote?: string) => void
}

export interface ActionSpec {
  id: string
  description: string
  triggerPatterns: RegExp[]
  allow: (user: User) => boolean
  fields: FieldSpec[]
  summarize: (collected: Record<string, string>, ctx: ActionContext) => string
  execute: (collected: Record<string, string>, ctx: ActionContext) => string
}

const TASK_STATUSES: TaskStatus[] = ['Not Started', 'In Progress', 'Blocked', 'Completed']
const PROJECT_STATUSES: ProjectStatus[] = ['On Track', 'Delayed', 'Breached']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

function addDaysClamped(dateStr: string, days: number, floor: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setDate(d.getDate() + days)
  const result = d.toISOString().split('T')[0]
  return result < floor ? floor : result
}

export const ACTIONS: ActionSpec[] = [
  {
    id: 'onboardTeamLead',
    description: 'onboard a new Team Lead',
    triggerPatterns: [/onboard.*team ?lead/i, /add.*team ?lead/i, /create.*team ?lead/i],
    allow: isManager,
    fields: [textField('name', "What's the new Team Lead's name?"), emailField('email', "What's their email?"), optionalTextField('domain', 'Which domain do they belong to? (or say "skip")')],
    summarize: (c) => `Onboard Team Lead: ${c.name} (${c.email})${c.domain ? `, domain: ${c.domain}` : ''}.`,
    execute: (c, ctx) => {
      ctx.addUser({ name: c.name, email: c.email, role: 'Team Lead', reportsToId: ctx.currentUser.id, domain: c.domain || undefined, isActive: true })
      return `Done — ${c.name} has been onboarded as a Team Lead.`
    },
  },
  {
    id: 'onboardDeveloper',
    description: 'onboard a new Developer to your team',
    triggerPatterns: [/onboard.*developer/i, /add.*developer/i, /create.*developer/i],
    allow: isTeamLead,
    fields: [textField('name', "What's the new developer's name?"), emailField('email', "What's their email?"), optionalTextField('domain', 'Which domain do they work in? (or say "skip")')],
    summarize: (c) => `Onboard Developer: ${c.name} (${c.email}), reporting to you.`,
    execute: (c, ctx) => {
      ctx.addUser({ name: c.name, email: c.email, role: 'Developer', reportsToId: ctx.currentUser.id, domain: c.domain || undefined, isActive: true })
      return `Done — ${c.name} has been onboarded to your team.`
    },
  },
  {
    id: 'onboardProject',
    description: 'onboard a new project',
    triggerPatterns: [/onboard.*project/i, /(add|create|new).*project/i],
    allow: isManager,
    fields: [
      textField('projectId', "What's the project code? (e.g. PRJ-FIN-004)"),
      textField('name', "What's the project name?"),
      domainField('domainId', 'Which domain does it belong to?'),
      dateField('goLiveDate', "What's the target go-live date? (YYYY-MM-DD)"),
      optionalTextField('description', 'Give a short description of the project (or say "skip").'),
      enumField('priority', `What's the priority? (${PRIORITIES.join(' / ')})`, PRIORITIES),
      optionalTextField('businessOwner', 'Who is the business owner? (or say "skip")'),
    ],
    summarize: (c, ctx) => `Onboard Project: ${c.name} (${c.projectId}) in ${ctx.domains.find((d) => d.id === c.domainId)?.name}, priority ${c.priority}, go-live ${c.goLiveDate}.`,
    execute: (c, ctx) => {
      const domain = ctx.domains.find((d) => d.id === c.domainId)!
      const today = todayStr()
      const plannedStartDate = today
      const devStartDate = addDaysClamped(today, 7, today)
      const sitStartDate = addDaysClamped(c.goLiveDate, -42, devStartDate)
      const uatStartDate = addDaysClamped(c.goLiveDate, -21, sitStartDate)
      ctx.addProject({
        projectId: c.projectId, name: c.name,
        description: c.description || `${c.name} — onboarded via chatbot by ${ctx.currentUser.name}.`,
        domainId: domain.id, domainName: domain.name,
        subDomain: '', businessUnit: '', businessOwner: c.businessOwner || ctx.currentUser.name, projectManager: ctx.currentUser.name,
        developer: 'Unassigned', qaOwner: 'Unassigned', supportOwner: 'Unassigned',
        plannedStartDate, devStartDate, sitStartDate, uatStartDate, goLiveDate: c.goLiveDate,
        status: 'On Track', priority: c.priority as Project['priority'], riskLevel: 'Low', deliveryMethodology: 'Agile',
        slaTarget: 90, completionPercentage: 0, budgetStatus: 'On Budget', healthIndicator: 'Healthy',
        comments: 'Onboarded via chatbot.', delayCount: 0, escalationStatus: false, slaCompliance: true,
        governanceRemarks: `Onboarded via chatbot by ${ctx.currentUser.name} on ${today}.`,
      })
      return `Done — "${c.name}" has been onboarded and is now visible under All Projects. Developer/QA/Support owners are set to "Unassigned" — assign them from the project's Edit screen when ready.`
    },
  },
  {
    id: 'assignProjectTeamLead',
    description: 'assign a project to a Team Lead',
    triggerPatterns: [/assign.*project/i, /assign.*team ?lead/i],
    allow: isManager,
    fields: [textField('projectName', 'Which project?'), teamLeadField('teamLeadId', 'Assign it to which Team Lead?')],
    summarize: (c, ctx) => {
      const project = fuzzyFind(c.projectName, ctx.projects, (p) => p.name)
      const tl = ctx.users.find((u) => u.id === c.teamLeadId)
      return `Assign "${project?.name ?? c.projectName}" to ${tl?.name}.`
    },
    execute: (c, ctx) => {
      const project = fuzzyFind(c.projectName, ctx.projects, (p) => p.name)
      if (!project) return `Couldn't find a project matching "${c.projectName}".`
      ctx.updateProject(project.id, { teamLeadId: c.teamLeadId })
      const tl = ctx.users.find((u) => u.id === c.teamLeadId)
      return `Done — "${project.name}" is now assigned to ${tl?.name}.`
    },
  },
  {
    id: 'updateProjectStatus',
    description: "update a project's status (for projects you own)",
    triggerPatterns: [/update.*(project|status)/i, /change.*status/i, /set.*status/i],
    allow: (u) => isManager(u) || isTeamLead(u),
    fields: [
      editableProjectField('projectId', 'Which project?'),
      enumField('status', `What's the new status? (${PROJECT_STATUSES.join(' / ')})`, PROJECT_STATUSES),
      percentField('completionPercentage', "What's the completion percentage now? (0-100)"),
      optionalTextField('comments', 'Any comments to add? (or say "skip")'),
    ],
    summarize: (c, ctx) => `Update "${ctx.projects.find((p) => p.id === c.projectId)?.name}": status → ${c.status}, completion → ${c.completionPercentage}%${c.comments ? `, comment: "${c.comments}"` : ''}.`,
    execute: (c, ctx) => {
      ctx.updateProject(c.projectId, {
        status: c.status as ProjectStatus,
        completionPercentage: Number(c.completionPercentage),
        ...(c.comments ? { comments: c.comments } : {}),
      })
      return `Done — status updated.`
    },
  },
  {
    id: 'submitDailyUpdate',
    description: "submit today's update on one of your tasks",
    triggerPatterns: [/submit.*update/i, /log.*update/i, /update.*(my )?task/i, /update.*progress/i],
    allow: isDeveloper,
    fields: [
      myTaskField('taskId', 'Which task is this update for?'),
      enumField('status', `What's the task status now? (${TASK_STATUSES.join(' / ')})`, TASK_STATUSES),
      optionalTextField('note', 'Any note for today? (or say "skip")'),
    ],
    summarize: (c, ctx) => `Log today's update on "${ctx.tasks.find((t) => t.id === c.taskId)?.title}": ${c.status}${c.note ? ` — "${c.note}"` : ''}.`,
    execute: (c, ctx) => {
      const today = todayStr()
      const existing = ctx.getDailyUpdate(ctx.currentUser.id, today)
      const entries = (existing?.entries ?? []).filter((e) => e.taskId !== c.taskId)
      entries.push({ taskId: c.taskId, status: c.status as TaskStatus, note: c.note })
      ctx.submitDailyUpdate(ctx.currentUser.id, today, entries, existing?.overallNote)
      return `Done — today's update is submitted.`
    },
  },
]

export function detectActionIntent(text: string): ActionSpec | undefined {
  return ACTIONS.find((a) => a.triggerPatterns.some((rx) => rx.test(text)))
}

export function describeCapabilities(user: User): string {
  const mine = ACTIONS.filter((a) => a.allow(user))
  if (mine.length === 0) return 'No actions are available for your role.'
  return mine.map((a) => `• Ask me to ${a.description}`).join('\n')
}
