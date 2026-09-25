export type ProjectStatus = 'On Track' | 'Delayed' | 'Breached'
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'
export type RiskLevel = 'Low' | 'Medium' | 'High'
export type BlockerSeverity = 'Low' | 'Medium' | 'High' | 'Critical'
export type BlockerStatus = 'Open' | 'In Progress' | 'Resolved' | 'Escalated' | 'Closed'
export type UserRole = 'Manager' | 'Team Lead' | 'Developer'
export type TaskStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Completed'
export type BudgetStatus = 'On Budget' | 'Over Budget' | 'Under Budget'
export type HealthIndicator = 'Healthy' | 'At Risk' | 'Critical'
export type DeliveryMethodology = 'Agile' | 'Waterfall' | 'Hybrid' | 'SAFe' | 'Scrum' | 'Kanban'
export type BlockerType = 'Technical' | 'Resource' | 'Approval' | 'Dependency' | 'Environment' | 'Requirement'

export interface Domain {
  id: string
  name: string
  description: string
  owner: string
  ownerEmail: string
  isActive: boolean
  projectCount: number
  color: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  projectId: string
  name: string
  description: string
  domainId: string
  domainName: string
  subDomain: string
  businessUnit: string
  businessOwner: string
  projectManager: string
  developer: string
  qaOwner: string
  supportOwner: string
  plannedStartDate: string
  devStartDate: string
  sitStartDate: string
  uatStartDate: string
  goLiveDate: string
  actualCompletionDate?: string
  status: ProjectStatus
  priority: Priority
  riskLevel: RiskLevel
  deliveryMethodology: DeliveryMethodology
  slaTarget: number
  completionPercentage: number
  budgetStatus: BudgetStatus
  healthIndicator: HealthIndicator
  comments: string
  delayCount: number
  escalationStatus: boolean
  slaCompliance: boolean
  governanceRemarks: string
  teamLeadId?: string
  createdAt: string
  updatedAt: string
}

export interface Blocker {
  id: string
  projectId: string
  projectName: string
  blockerType: BlockerType
  severity: BlockerSeverity
  description: string
  raisedBy: string
  raisedDate: string
  assignedOwner: string
  eta: string
  resolutionNotes: string
  status: BlockerStatus
  createdAt: string
  updatedAt: string
}

export interface Risk {
  id: string
  projectId: string
  description: string
  impact: 'Low' | 'Medium' | 'High'
  probability: 'Low' | 'Medium' | 'High'
  mitigation: string
  owner: string
  status: 'Open' | 'Mitigated' | 'Closed'
}

export interface Milestone {
  id: string
  projectId: string
  name: string
  plannedDate: string
  actualDate?: string
  status: 'Pending' | 'Completed' | 'Delayed'
}

export interface GovernanceLog {
  id: string
  entityType: 'Project' | 'Domain' | 'Blocker' | 'Risk'
  entityId: string
  entityName: string
  action: string
  performedBy: string
  timestamp: string
  changes: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  reportsToId?: string
  domain?: string
  avatar?: string
  isActive?: boolean
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  assignedToId: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface TaskUpdateEntry {
  taskId: string
  status: TaskStatus
  note: string
}

export interface DailyUpdate {
  id: string
  developerId: string
  date: string
  entries: TaskUpdateEntry[]
  overallNote?: string
  submittedAt: string
}

export interface KPIData {
  totalProjects: number
  onTrack: number
  delayed: number
  breached: number
  upcomingGoLives: number
  highRisk: number
  pendingUAT: number
  slaCompliance: number
}
