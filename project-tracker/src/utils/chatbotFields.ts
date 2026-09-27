import type { User, Project, Domain, Task, Blocker, TaskUpdateEntry } from '../types'
import { isTeamLead, canEditProject, getVisibleProjects } from './permissions'

export interface FieldContext {
  currentUser: User
  users: User[]
  projects: Project[]
  domains: Domain[]
  tasks: Task[]
  blockers: Blocker[]
  getDailyUpdate: (developerId: string, date: string) => { entries: TaskUpdateEntry[]; overallNote?: string } | undefined
}

type Resolved = { ok: true; value: string } | { ok: false; error: string }

export interface FieldSpec {
  key: string
  prompt: string
  resolve: (raw: string, ctx: FieldContext) => Resolved
}

export function fuzzyFind<T>(raw: string, items: T[], label: (t: T) => string): T | undefined {
  const q = raw.toLowerCase().trim()
  return items.find((i) => label(i).toLowerCase() === q)
    ?? items.find((i) => label(i).toLowerCase().includes(q))
    ?? items.find((i) => q.includes(label(i).toLowerCase()))
}

export function textField(key: string, prompt: string): FieldSpec {
  return { key, prompt, resolve: (raw) => raw.trim() ? { ok: true, value: raw.trim() } : { ok: false, error: "That can't be empty — try again." } }
}

export function optionalTextField(key: string, prompt: string): FieldSpec {
  return { key, prompt, resolve: (raw) => ({ ok: true, value: /^(skip|none|-)$/i.test(raw.trim()) ? '' : raw.trim() }) }
}

export function emailField(key: string, prompt: string): FieldSpec {
  return {
    key, prompt,
    resolve: (raw) => /^\S+@\S+\.\S+$/.test(raw.trim()) ? { ok: true, value: raw.trim() } : { ok: false, error: 'That doesn\'t look like an email address — try again (e.g. name@company.com).' },
  }
}

export function dateField(key: string, prompt: string): FieldSpec {
  return {
    key, prompt,
    resolve: (raw) => /^\d{4}-\d{2}-\d{2}$/.test(raw.trim()) ? { ok: true, value: raw.trim() } : { ok: false, error: 'Please use YYYY-MM-DD format, e.g. 2025-09-30.' },
  }
}

export function enumField(key: string, prompt: string, options: string[]): FieldSpec {
  return {
    key, prompt,
    resolve: (raw) => {
      const match = options.find((o) => o.toLowerCase() === raw.trim().toLowerCase())
      return match ? { ok: true, value: match } : { ok: false, error: `Please pick one of: ${options.join(', ')}.` }
    },
  }
}

export function percentField(key: string, prompt: string): FieldSpec {
  return {
    key, prompt,
    resolve: (raw) => {
      const n = Number(raw.trim())
      return Number.isFinite(n) && n >= 0 && n <= 100 ? { ok: true, value: String(n) } : { ok: false, error: 'Please give a number between 0 and 100.' }
    },
  }
}

export function domainField(key: string, prompt: string): FieldSpec {
  return {
    key, prompt,
    resolve: (raw, ctx) => {
      const domain = fuzzyFind(raw, ctx.domains, (d) => d.name)
      return domain ? { ok: true, value: domain.id } : { ok: false, error: `Couldn't find a domain matching "${raw}". Existing domains: ${ctx.domains.map((d) => d.name).join(', ')}.` }
    },
  }
}

export function teamLeadField(key: string, prompt: string): FieldSpec {
  return {
    key, prompt,
    resolve: (raw, ctx) => {
      const tl = fuzzyFind(raw, ctx.users.filter(isTeamLead), (u) => u.name)
      return tl ? { ok: true, value: tl.id } : { ok: false, error: `Couldn't find a Team Lead matching "${raw}". Team Leads: ${ctx.users.filter(isTeamLead).map((u) => u.name).join(', ')}.` }
    },
  }
}

export function editableProjectField(key: string, prompt: string): FieldSpec {
  return {
    key, prompt,
    resolve: (raw, ctx) => {
      const candidates = ctx.projects.filter((p) => canEditProject(ctx.currentUser, p))
      const project = fuzzyFind(raw, candidates, (p) => p.name)
      return project ? { ok: true, value: project.id } : { ok: false, error: `Couldn't find a project you can edit matching "${raw}". Yours: ${candidates.map((p) => p.name).join(', ') || 'none'}.` }
    },
  }
}

export function myTaskField(key: string, prompt: string): FieldSpec {
  return {
    key, prompt,
    resolve: (raw, ctx) => {
      const mine = ctx.tasks.filter((t) => t.assignedToId === ctx.currentUser.id)
      const task = fuzzyFind(raw, mine, (t) => t.title)
      return task ? { ok: true, value: task.id } : { ok: false, error: `Couldn't find a task of yours matching "${raw}". Your tasks: ${mine.map((t) => t.title).join(', ') || 'none'}.` }
    },
  }
}

export function visibleProjectField(key: string, prompt: string): FieldSpec {
  return {
    key, prompt,
    resolve: (raw, ctx) => {
      const candidates = getVisibleProjects(ctx.currentUser, ctx.projects, ctx.tasks)
      const project = fuzzyFind(raw, candidates, (p) => p.name)
      return project ? { ok: true, value: project.id } : { ok: false, error: `Couldn't find a project of yours matching "${raw}". Yours: ${candidates.map((p) => p.name).join(', ') || 'none'}.` }
    },
  }
}

export function openBlockerField(key: string, prompt: string): FieldSpec {
  return {
    key, prompt,
    resolve: (raw, ctx) => {
      const open = ctx.blockers.filter((b) => b.status !== 'Resolved' && b.status !== 'Closed')
      const blocker = fuzzyFind(raw, open, (b) => `${b.projectName} ${b.description}`)
      return blocker ? { ok: true, value: blocker.id } : { ok: false, error: `Couldn't find an open blocker matching "${raw}". Open blockers: ${open.map((b) => `${b.projectName}: ${b.description.slice(0, 40)}`).join(' | ') || 'none'}.` }
    },
  }
}
