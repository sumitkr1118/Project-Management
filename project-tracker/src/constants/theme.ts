import type { UserRole } from '../types'

export const COLORS = {
  primaryBlue: '#007560',       // DEWA primary green
  successGreen: '#007560',
  warningOrange: '#E26D5A',     // accent orange for warning states
  criticalRed: '#B00020',
  darkBackground: '#004937',    // primary variant, deep green sidebar
  silverGray: '#D7D7DF',
  goldAccent: '#FFC600',
  lightBackground: '#F2F3F3',
  white: '#FFFFFF',
  cardBackground: '#FFFFFF',
  textPrimary: '#222222',
  textSecondary: '#6F6F6F',
  borderColor: '#D7D7DF',
  sidebarText: '#9CC9BE',
  sidebarActiveText: '#FFFFFF',
  sidebarActiveBg: 'rgba(255,255,255,0.14)',
  tableRowHover: '#E5F1EF',
} as const

export const STATUS_COLORS: Record<string, string> = {
  'On Track': '#007560',
  'Delayed': '#E26D5A',
  'Breached': '#B00020',
}

export const STATUS_BG: Record<string, string> = {
  'On Track': '#D9EAE7',
  'Delayed': '#F3E6DD',
  'Breached': '#F3D9DE',
}

export const PRIORITY_COLORS: Record<string, string> = {
  'Low': '#6F6F6F',
  'Medium': '#0B7BC1',
  'High': '#E26D5A',
  'Critical': '#B00020',
}

export const PRIORITY_BG: Record<string, string> = {
  'Low': '#F2F3F3',
  'Medium': '#DAEBF6',
  'High': '#F3E6DD',
  'Critical': '#F3D9DE',
}

export const SEVERITY_COLORS: Record<string, string> = {
  'Low': '#6F6F6F',
  'Medium': '#0B7BC1',
  'High': '#E26D5A',
  'Critical': '#B00020',
}

export const BLOCKER_STATUS_COLORS: Record<string, string> = {
  'Open': '#B00020',
  'In Progress': '#0B7BC1',
  'Resolved': '#007560',
  'Escalated': '#A2511A',
  'Closed': '#6F6F6F',
}

export const BLOCKER_STATUS_BG: Record<string, string> = {
  'Open': '#F3D9DE',
  'In Progress': '#DAEBF6',
  'Resolved': '#D9EAE7',
  'Escalated': '#F3E6DD',
  'Closed': '#F2F3F3',
}

export const HEALTH_COLORS: Record<string, string> = {
  'Healthy': '#007560',
  'At Risk': '#E26D5A',
  'Critical': '#B00020',
}

export const RISK_COLORS: Record<string, string> = {
  'Low': '#0B7BC1',
  'Medium': '#E26D5A',
  'High': '#B00020',
}

export const DOMAIN_PALETTE = [
  '#007560', '#004937', '#0B7BC1', '#0469A8',
  '#E26D5A', '#A2511A', '#FFC600', '#152685',
  '#6C47CC', '#60A5FA', '#B00020', '#27A28D',
]

export interface NavItem {
  path: string
  label: string
  icon: string
  roles?: UserRole[]
}

export const ROLE_COLORS: Record<string, string> = {
  Manager: '#007560',
  'Team Lead': '#E26D5A',
  Developer: '#6C47CC',
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Executive Dashboard', icon: 'LayoutDashboard' },
  { path: '/domains', label: 'Domain Management', icon: 'Building2' },
  { path: '/projects', label: 'All Projects', icon: 'FolderKanban' },
  { path: '/blockers', label: 'Blocker Management', icon: 'AlertTriangle' },
  { path: '/governance', label: 'Governance Logs', icon: 'FileText' },
  { path: '/admin', label: 'Administration', icon: 'ShieldCheck', roles: ['Manager', 'Team Lead'] },
  { path: '/my-updates', label: 'My Daily Updates', icon: 'ClipboardList', roles: ['Developer'] },
]
