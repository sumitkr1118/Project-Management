import type { User, Project, Domain, Blocker, TaskUpdateEntry } from '../types'
import type { FieldSpec, FieldContext } from './chatbotFields'

export interface ActionContext extends FieldContext {
  addUser: (u: Omit<User, 'id'>) => void
  addProject: (p: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  addDomain: (d: Omit<Domain, 'id' | 'createdAt' | 'updatedAt' | 'projectCount'>) => void
  addBlocker: (b: Omit<Blocker, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBlocker: (id: string, updates: Partial<Blocker>) => void
  submitDailyUpdate: (developerId: string, date: string, entries: TaskUpdateEntry[], overallNote?: string) => void
}

export interface ActionSpec {
  id: string
  description: string
  match: (text: string) => number
  allow: (user: User) => boolean
  fields: FieldSpec[]
  summarize: (collected: Record<string, string>, ctx: ActionContext) => string
  execute: (collected: Record<string, string>, ctx: ActionContext) => string
}

export function addDaysClamped(dateStr: string, days: number, floor: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setDate(d.getDate() + days)
  const result = d.toISOString().split('T')[0]
  return result < floor ? floor : result
}

export const TASK_STATUSES = ['Not Started', 'In Progress', 'Blocked', 'Completed'] as const
export const PROJECT_STATUSES = ['On Track', 'Delayed', 'Breached'] as const
export const HEALTH_STATES = ['Healthy', 'At Risk', 'Critical'] as const
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const
export const BLOCKER_TYPES = ['Technical', 'Resource', 'Approval', 'Dependency', 'Environment', 'Requirement'] as const
export const BLOCKER_SEVERITIES = ['Low', 'Medium', 'High', 'Critical'] as const
export const BLOCKER_STATUSES = ['Open', 'In Progress', 'Resolved', 'Escalated', 'Closed'] as const
