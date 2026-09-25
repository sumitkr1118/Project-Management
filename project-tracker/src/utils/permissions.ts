import type { User, UserRole, Project, Task } from '../types'

export function isManager(u: User): boolean { return u.role === 'Manager' }
export function isTeamLead(u: User): boolean { return u.role === 'Team Lead' }
export function isDeveloper(u: User): boolean { return u.role === 'Developer' }

export function canEditProject(user: User, project: Project): boolean {
  if (isManager(user)) return true
  if (isTeamLead(user)) return project.teamLeadId === user.id
  return false
}

export function getVisibleProjects(user: User, projects: Project[], tasks: Task[]): Project[] {
  if (isManager(user)) return projects
  if (isTeamLead(user)) return projects.filter((p) => p.teamLeadId === user.id)
  const myProjectIds = new Set(tasks.filter((t) => t.assignedToId === user.id).map((t) => t.projectId))
  return projects.filter((p) => myProjectIds.has(p.id))
}

export function getVisibleTasks(user: User, tasks: Task[]): Task[] {
  return isDeveloper(user) ? tasks.filter((t) => t.assignedToId === user.id) : tasks
}

export function getReportees(user: User, users: User[]): User[] {
  return users.filter((u) => u.reportsToId === user.id)
}

export function canAccessAdmin(user: User): boolean { return isManager(user) || isTeamLead(user) }
export function canManageProjectAssignment(user: User): boolean { return isManager(user) }
export function canOnboardDeveloper(user: User): boolean { return isTeamLead(user) }
export function canOnboardProject(user: User): boolean { return isManager(user) }

export function filterNavItemsByRole<T extends { roles?: UserRole[] }>(items: T[], role: UserRole): T[] {
  return items.filter((i) => !i.roles || i.roles.includes(role))
}
