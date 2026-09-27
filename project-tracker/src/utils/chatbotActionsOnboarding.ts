import type { Project, HealthIndicator } from '../types'
import { isManager, isTeamLead } from './permissions'
import { todayStr } from './reminderEngine'
import { actionScore, CREATE_VERBS, ASSIGN_VERBS } from './chatbotIntent'
import { textField, emailField, optionalTextField, dateField, enumField, domainField, teamLeadField, fuzzyFind } from './chatbotFields'
import { type ActionSpec, addDaysClamped, PRIORITIES } from './chatbotActionTypes'

export const ONBOARDING_ACTIONS: ActionSpec[] = [
  {
    id: 'onboardTeamLead',
    description: 'onboard a new Team Lead',
    match: (q) => actionScore(q, CREATE_VERBS, [['team lead', 2], ['teamlead', 2]]),
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
    match: (q) => actionScore(q, CREATE_VERBS, [['developer', 2], ['dev ', 1], ['engineer', 1]]),
    allow: isTeamLead,
    fields: [textField('name', "What's the new developer's name?"), emailField('email', "What's their email?"), optionalTextField('domain', 'Which domain do they work in? (or say "skip")')],
    summarize: (c) => `Onboard Developer: ${c.name} (${c.email}), reporting to you.`,
    execute: (c, ctx) => {
      ctx.addUser({ name: c.name, email: c.email, role: 'Developer', reportsToId: ctx.currentUser.id, domain: c.domain || undefined, isActive: true })
      return `Done — ${c.name} has been onboarded to your team.`
    },
  },
  {
    id: 'onboardDomain',
    description: 'onboard a new domain',
    match: (q) => actionScore(q, CREATE_VERBS, [['domain', 2]]),
    allow: isManager,
    fields: [textField('name', "What's the domain name?"), optionalTextField('description', 'A short description? (or say "skip")')],
    summarize: (c) => `Onboard Domain: ${c.name}.`,
    execute: (c, ctx) => {
      ctx.addDomain({ name: c.name, description: c.description || `${c.name} domain.`, owner: ctx.currentUser.name, ownerEmail: ctx.currentUser.email, isActive: true, color: '#007560' })
      return `Done — "${c.name}" has been onboarded as a domain.`
    },
  },
  {
    id: 'onboardProject',
    description: 'onboard a new project',
    match: (q) => actionScore(q, CREATE_VERBS, [['project', 1]]),
    allow: isManager,
    fields: [
      textField('projectId', "What's the project code? (e.g. PRJ-FIN-004)"),
      textField('name', "What's the project name?"),
      domainField('domainId', 'Which domain does it belong to?'),
      dateField('goLiveDate', "What's the target go-live date? (YYYY-MM-DD)"),
      optionalTextField('description', 'Give a short description of the project (or say "skip").'),
      enumField('priority', `What's the priority? (${PRIORITIES.join(' / ')})`, [...PRIORITIES]),
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
        slaTarget: 90, completionPercentage: 0, budgetStatus: 'On Budget', healthIndicator: 'Healthy' as HealthIndicator,
        comments: 'Onboarded via chatbot.', delayCount: 0, escalationStatus: false, slaCompliance: true,
        governanceRemarks: `Onboarded via chatbot by ${ctx.currentUser.name} on ${today}.`,
      })
      return `Done — "${c.name}" has been onboarded and is now visible under All Projects. Developer/QA/Support owners are set to "Unassigned" — assign them from the project's Edit screen when ready.`
    },
  },
  {
    id: 'assignProjectTeamLead',
    description: 'assign a project to a Team Lead',
    match: (q) => actionScore(q, ASSIGN_VERBS, [['project', 1], ['team lead', 2], ['teamlead', 2]]),
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
]
