import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Domain, Project, Blocker, GovernanceLog } from '../types'
import {
  MOCK_DOMAINS, MOCK_PROJECTS, MOCK_BLOCKERS,
  MOCK_GOVERNANCE_LOGS,
} from '../data/mockData'
import { useTeam } from './TeamContext'

interface AppContextType {
  domains: Domain[]
  projects: Project[]
  blockers: Blocker[]
  governanceLogs: GovernanceLog[]
  selectedDomainFilter: string
  setSelectedDomainFilter: (id: string) => void
  addDomain: (domain: Omit<Domain, 'id' | 'createdAt' | 'updatedAt' | 'projectCount'>) => void
  updateDomain: (id: string, updates: Partial<Domain>) => void
  deleteDomain: (id: string) => void
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  addBlocker: (blocker: Omit<Blocker, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBlocker: (id: string, updates: Partial<Blocker>) => void
  getProjectById: (id: string) => Project | undefined
  getBlockersByProject: (projectId: string) => Blocker[]
  logAction: (log: Omit<GovernanceLog, 'id' | 'timestamp'>) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useTeam()
  const [domains, setDomains] = useState<Domain[]>(() => {
    try { const s = localStorage.getItem('pgdm_domains'); return s ? JSON.parse(s) : MOCK_DOMAINS } catch { return MOCK_DOMAINS }
  })
  const [projects, setProjects] = useState<Project[]>(() => {
    try { const s = localStorage.getItem('pgdm_projects'); return s ? JSON.parse(s) : MOCK_PROJECTS } catch { return MOCK_PROJECTS }
  })
  const [blockers, setBlockers] = useState<Blocker[]>(() => {
    try { const s = localStorage.getItem('pgdm_blockers'); return s ? JSON.parse(s) : MOCK_BLOCKERS } catch { return MOCK_BLOCKERS }
  })
  const [governanceLogs, setGovernanceLogs] = useState<GovernanceLog[]>(MOCK_GOVERNANCE_LOGS)
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all')

  useEffect(() => { localStorage.setItem('pgdm_domains', JSON.stringify(domains)) }, [domains])
  useEffect(() => { localStorage.setItem('pgdm_projects', JSON.stringify(projects)) }, [projects])
  useEffect(() => { localStorage.setItem('pgdm_blockers', JSON.stringify(blockers)) }, [blockers])

  const logAction = useCallback((log: Omit<GovernanceLog, 'id' | 'timestamp'>) => {
    setGovernanceLogs((prev) => [
      { ...log, id: generateId(), timestamp: new Date().toISOString() },
      ...prev,
    ])
  }, [])

  const addDomain = useCallback((domain: Omit<Domain, 'id' | 'createdAt' | 'updatedAt' | 'projectCount'>) => {
    const now = new Date().toISOString().split('T')[0]
    const newDomain: Domain = { ...domain, id: generateId(), projectCount: 0, createdAt: now, updatedAt: now }
    setDomains((prev) => [...prev, newDomain])
    logAction({ entityType: 'Domain', entityId: newDomain.id, entityName: newDomain.name, action: 'Domain Created', performedBy: currentUser.name, changes: `New domain "${newDomain.name}" created.` })
  }, [logAction, currentUser.name])

  const updateDomain = useCallback((id: string, updates: Partial<Domain>) => {
    setDomains((prev) => prev.map((d) => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : d))
    logAction({ entityType: 'Domain', entityId: id, entityName: updates.name ?? id, action: 'Domain Updated', performedBy: currentUser.name, changes: Object.keys(updates).join(', ') + ' updated.' })
  }, [logAction, currentUser.name])

  const deleteDomain = useCallback((id: string) => {
    const domain = domains.find((d) => d.id === id)
    setDomains((prev) => prev.filter((d) => d.id !== id))
    logAction({ entityType: 'Domain', entityId: id, entityName: domain?.name ?? id, action: 'Domain Deleted', performedBy: currentUser.name, changes: 'Domain deactivated and removed.' })
  }, [domains, logAction, currentUser.name])

  const addProject = useCallback((project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0]
    const newProject: Project = { ...project, id: generateId(), createdAt: now, updatedAt: now }
    setProjects((prev) => [...prev, newProject])
    setDomains((prev) => prev.map((d) => d.id === project.domainId ? { ...d, projectCount: d.projectCount + 1 } : d))
    logAction({ entityType: 'Project', entityId: newProject.id, entityName: newProject.name, action: 'Project Created', performedBy: currentUser.name, changes: `New project "${newProject.name}" onboarded to ${newProject.domainName}.` })
  }, [logAction, currentUser.name])

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => {
      if (p.id !== id) return p
      const updated = { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
      logAction({ entityType: 'Project', entityId: id, entityName: updated.name, action: 'Project Updated', performedBy: currentUser.name, changes: Object.keys(updates).join(', ') + ' updated.' })
      return updated
    }))
  }, [logAction, currentUser.name])

  const deleteProject = useCallback((id: string) => {
    const project = projects.find((p) => p.id === id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
    if (project) {
      setDomains((prev) => prev.map((d) => d.id === project.domainId ? { ...d, projectCount: Math.max(0, d.projectCount - 1) } : d))
      logAction({ entityType: 'Project', entityId: id, entityName: project.name, action: 'Project Deleted', performedBy: currentUser.name, changes: 'Project removed from portfolio.' })
    }
  }, [projects, logAction, currentUser.name])

  const addBlocker = useCallback((blocker: Omit<Blocker, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0]
    const newBlocker: Blocker = { ...blocker, id: generateId(), createdAt: now, updatedAt: now }
    setBlockers((prev) => [...prev, newBlocker])
    logAction({ entityType: 'Blocker', entityId: newBlocker.id, entityName: newBlocker.description.slice(0, 40), action: 'Blocker Raised', performedBy: currentUser.name, changes: `${newBlocker.severity} severity blocker raised on ${newBlocker.projectName}.` })
  }, [logAction, currentUser.name])

  const updateBlocker = useCallback((id: string, updates: Partial<Blocker>) => {
    setBlockers((prev) => prev.map((b) => b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : b))
    logAction({ entityType: 'Blocker', entityId: id, entityName: updates.description?.slice(0, 40) ?? id, action: 'Blocker Updated', performedBy: currentUser.name, changes: Object.keys(updates).join(', ') + ' updated.' })
  }, [logAction, currentUser.name])

  const getProjectById = useCallback((id: string) => projects.find((p) => p.id === id), [projects])
  const getBlockersByProject = useCallback((projectId: string) => blockers.filter((b) => b.projectId === projectId), [blockers])

  return (
    <AppContext.Provider value={{
      domains, projects, blockers, governanceLogs,
      selectedDomainFilter, setSelectedDomainFilter,
      addDomain, updateDomain, deleteDomain,
      addProject, updateProject, deleteProject,
      addBlocker, updateBlocker,
      getProjectById, getBlockersByProject, logAction,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
