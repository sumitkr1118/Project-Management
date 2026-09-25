import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, Task, DailyUpdate, TaskUpdateEntry } from '../types'
import { MOCK_USERS, MOCK_TASKS, MOCK_DAILY_UPDATES } from '../data/mockData'
import { resolvePowerPlatformIdentity } from '../utils/identity'

type IdentitySource = 'power-platform' | 'fallback-mock'

interface TeamContextType {
  currentUser: User
  identitySource: IdentitySource
  isResolvingIdentity: boolean
  viewAsUserId: string | null
  setViewAsUserId: (id: string | null) => void
  users: User[]
  tasks: Task[]
  dailyUpdates: DailyUpdate[]
  addUser: (u: Omit<User, 'id'>) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deactivateUser: (id: string) => void
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  submitDailyUpdate: (developerId: string, date: string, entries: TaskUpdateEntry[], overallNote?: string) => void
  getDailyUpdate: (developerId: string, date: string) => DailyUpdate | undefined
  getTasksForUser: (userId: string) => Task[]
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function TeamProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    try { const s = localStorage.getItem('pgdm_users'); return s ? JSON.parse(s) : MOCK_USERS } catch { return MOCK_USERS }
  })
  const [tasks, setTasks] = useState<Task[]>(() => {
    try { const s = localStorage.getItem('pgdm_tasks'); return s ? JSON.parse(s) : MOCK_TASKS } catch { return MOCK_TASKS }
  })
  const [dailyUpdates, setDailyUpdates] = useState<DailyUpdate[]>(() => {
    try { const s = localStorage.getItem('pgdm_daily_updates'); return s ? JSON.parse(s) : MOCK_DAILY_UPDATES } catch { return MOCK_DAILY_UPDATES }
  })
  const [viewAsUserId, setViewAsUserIdState] = useState<string | null>(() => {
    try { return localStorage.getItem('pgdm_view_as') } catch { return null }
  })
  const [identitySource, setIdentitySource] = useState<IdentitySource>('fallback-mock')
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null)
  const [isResolvingIdentity, setIsResolvingIdentity] = useState(true)

  useEffect(() => { localStorage.setItem('pgdm_users', JSON.stringify(users)) }, [users])
  useEffect(() => { localStorage.setItem('pgdm_tasks', JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { localStorage.setItem('pgdm_daily_updates', JSON.stringify(dailyUpdates)) }, [dailyUpdates])

  useEffect(() => {
    let cancelled = false
    resolvePowerPlatformIdentity().then((identity) => {
      if (cancelled) return
      const email = identity?.email?.toLowerCase()
      const match = email ? users.find((u) => u.email.toLowerCase() === email) : undefined
      if (match) {
        setResolvedUserId(match.id)
        setIdentitySource('power-platform')
      } else {
        setIdentitySource('fallback-mock')
      }
      setIsResolvingIdentity(false)
    })
    return () => { cancelled = true }
    // Identity resolution should run once on mount only, not re-run as `users` changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setViewAsUserId = useCallback((id: string | null) => {
    setViewAsUserIdState(id)
    try {
      if (id) localStorage.setItem('pgdm_view_as', id)
      else localStorage.removeItem('pgdm_view_as')
    } catch { /* ignore */ }
  }, [])

  const currentUser: User =
    (identitySource === 'power-platform' && users.find((u) => u.id === resolvedUserId)) ||
    users.find((u) => u.id === viewAsUserId) ||
    users[0]

  const addUser = useCallback((u: Omit<User, 'id'>) => {
    setUsers((prev) => [...prev, { ...u, id: generateId() }])
  }, [])

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...updates } : u))
  }, [])

  const deactivateUser = useCallback((id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: false } : u))
  }, [])

  const addTask = useCallback((t: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0]
    setTasks((prev) => [...prev, { ...t, id: generateId(), createdAt: now, updatedAt: now }])
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : t))
  }, [])

  const getDailyUpdate = useCallback((developerId: string, date: string) => {
    return dailyUpdates.find((d) => d.developerId === developerId && d.date === date)
  }, [dailyUpdates])

  const submitDailyUpdate = useCallback((developerId: string, date: string, entries: TaskUpdateEntry[], overallNote?: string) => {
    setDailyUpdates((prev) => {
      const existing = prev.find((d) => d.developerId === developerId && d.date === date)
      const row: DailyUpdate = { id: existing?.id ?? generateId(), developerId, date, entries, overallNote, submittedAt: new Date().toISOString() }
      return existing ? prev.map((d) => d.id === existing.id ? row : d) : [...prev, row]
    })
  }, [])

  const getTasksForUser = useCallback((userId: string) => tasks.filter((t) => t.assignedToId === userId), [tasks])

  return (
    <TeamContext.Provider value={{
      currentUser, identitySource, isResolvingIdentity,
      viewAsUserId, setViewAsUserId,
      users, tasks, dailyUpdates,
      addUser, updateUser, deactivateUser,
      addTask, updateTask,
      submitDailyUpdate, getDailyUpdate, getTasksForUser,
    }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam(): TeamContextType {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeam must be used within TeamProvider')
  return ctx
}
