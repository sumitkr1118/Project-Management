import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ChevronRight, Users, FolderKanban, Plus,
  BarChart2, CheckCircle2, AlertOctagon, XCircle,
  Calendar, User, TrendingUp,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { COLORS, STATUS_COLORS } from '../constants/theme'
import StatusBadge from '../components/shared/StatusBadge'
import ProjectForm from '../components/project/ProjectForm'

export default function DomainDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { domains, projects, addProject } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'status' | 'completion' | 'goLive' | 'priority'>('status')

  const domain = domains.find((d) => d.id === id)
  const domainProjects = projects.filter((p) => p.domainId === id)

  if (!domain) {
    return (
      <div className="empty-state" style={{ marginTop: 60 }}>
        <FolderKanban size={48} color={COLORS.textSecondary} />
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary, marginTop: 12 }}>Domain not found</div>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/domains')}>
          Back to Domains
        </button>
      </div>
    )
  }

  const onTrack = domainProjects.filter((p) => p.status === 'On Track').length
  const delayed = domainProjects.filter((p) => p.status === 'Delayed').length
  const breached = domainProjects.filter((p) => p.status === 'Breached').length
  const avgCompletion = domainProjects.length
    ? Math.round(domainProjects.reduce((s, p) => s + p.completionPercentage, 0) / domainProjects.length)
    : 0

  const filtered = domainProjects
    .filter((p) => statusFilter === 'all' || p.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'completion') return b.completionPercentage - a.completionPercentage
      if (sortBy === 'goLive') return a.goLiveDate.localeCompare(b.goLiveDate)
      if (sortBy === 'priority') {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
        return (order[a.priority] ?? 4) - (order[b.priority] ?? 4)
      }
      const order = { Breached: 0, Delayed: 1, 'On Track': 2 }
      return (order[a.status] ?? 3) - (order[b.status] ?? 3)
    })

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/domains')}>
          Domain Management
        </span>
        <ChevronRight size={13} className="breadcrumb-sep" />
        <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>{domain.name}</span>
      </div>

      {/* Domain Header */}
      <div style={{
        background: COLORS.white,
        borderRadius: 14,
        padding: '24px 28px',
        marginBottom: 24,
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        borderLeft: `6px solid ${domain.color}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: domain.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FolderKanban size={22} color={domain.color} />
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.textPrimary, letterSpacing: '-0.3px' }}>{domain.name}</h1>
                <span style={{ fontSize: 12, fontWeight: 600, color: domain.isActive ? COLORS.successGreen : COLORS.textSecondary, background: domain.isActive ? '#D9EAE7' : '#EFEFF1', padding: '2px 10px', borderRadius: 99 }}>
                  {domain.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, maxWidth: 600, marginBottom: 16 }}>
              {domain.description || 'No description provided.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: COLORS.textSecondary }}>
                <Users size={14} color={COLORS.primaryBlue} />
                <span>Owner:</span>
                <span style={{ fontWeight: 700, color: COLORS.textPrimary }}>{domain.owner}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: COLORS.textSecondary }}>
                <Calendar size={14} />
                Since {domain.createdAt}
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ flexShrink: 0, marginLeft: 20 }}>
            <Plus size={15} /> Add Project
          </button>
        </div>

        {/* Domain KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginTop: 20, paddingTop: 20, borderTop: '1px solid #EFEFF1' }}>
          {[
            { label: 'Total Projects', value: domainProjects.length, icon: BarChart2, color: COLORS.primaryBlue },
            { label: 'On Track', value: onTrack, icon: CheckCircle2, color: COLORS.successGreen },
            { label: 'Delayed', value: delayed, icon: AlertOctagon, color: COLORS.warningOrange },
            { label: 'Breached', value: breached, icon: XCircle, color: COLORS.criticalRed },
            { label: 'Avg Completion', value: `${avgCompletion}%`, icon: TrendingUp, color: domain.color },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ textAlign: 'center', padding: '12px 8px', background: '#F2F3F3', borderRadius: 10, border: '1px solid #EFEFF1' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <Icon size={18} color={color} />
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: 600, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: COLORS.textPrimary }}>
          Projects in {domain.name}
          <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.textSecondary, marginLeft: 8 }}>({filtered.length} shown)</span>
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Status filter pills */}
          {(['all', 'On Track', 'Delayed', 'Breached'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                background: statusFilter === s ? (s === 'all' ? COLORS.primaryBlue : STATUS_COLORS[s] ?? COLORS.primaryBlue) : '#EFEFF1',
                color: statusFilter === s ? COLORS.white : COLORS.textSecondary,
                transition: 'all 0.15s',
              }}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
          <select
            className="form-input"
            style={{ padding: '6px 12px', fontSize: 12, width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="status">Sort: Status</option>
            <option value="completion">Sort: Completion</option>
            <option value="goLive">Sort: Go-Live</option>
            <option value="priority">Sort: Priority</option>
          </select>
        </div>
      </div>

      {/* Projects table */}
      {filtered.length === 0 ? (
        <div className="card empty-state" style={{ padding: '60px 24px' }}>
          <FolderKanban size={40} color={COLORS.textSecondary} style={{ opacity: 0.4, marginBottom: 12 }} />
          <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.textPrimary }}>No projects found</div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>
            {statusFilter !== 'all' ? `No ${statusFilter} projects in this domain.` : 'No projects yet. Add one to get started.'}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowForm(true)}>
            <Plus size={14} /> Add First Project
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Developer</th>
                  <th>Project Manager</th>
                  <th>Progress</th>
                  <th>Go-Live</th>
                  <th>Health</th>
                  <th>Budget</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isOverdue = new Date(p.goLiveDate) < new Date() && p.status !== 'On Track'
                  return (
                    <tr
                      key={p.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/projects/${p.id}`)}
                    >
                      {/* Project name + ID */}
                      <td style={{ minWidth: 220 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 4, height: 36, borderRadius: 2, background: STATUS_COLORS[p.status], flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.textPrimary, marginBottom: 2 }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: COLORS.primaryBlue, fontWeight: 600 }}>{p.projectId}</div>
                            {p.subDomain && <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{p.subDomain}</div>}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td><StatusBadge value={p.status} type="status" size="sm" /></td>

                      {/* Priority */}
                      <td><StatusBadge value={p.priority} type="priority" size="sm" /></td>

                      {/* Developer */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: COLORS.primaryBlue + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.primaryBlue }}>
                              {p.developer.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <span style={{ fontSize: 13, color: COLORS.textPrimary, fontWeight: 500 }}>{p.developer}</span>
                        </div>
                      </td>

                      {/* PM */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: COLORS.textSecondary }}>
                          <User size={12} />
                          {p.projectManager}
                        </div>
                      </td>

                      {/* Progress */}
                      <td style={{ minWidth: 140 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: '#D7D7DF', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${p.completionPercentage}%`, background: p.completionPercentage >= 80 ? COLORS.successGreen : p.completionPercentage >= 50 ? COLORS.primaryBlue : COLORS.warningOrange, borderRadius: 99, transition: 'width 0.5s ease' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textPrimary, minWidth: 32 }}>{p.completionPercentage}%</span>
                        </div>
                      </td>

                      {/* Go-live */}
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isOverdue ? COLORS.criticalRed : COLORS.textPrimary }}>{p.goLiveDate}</div>
                        {isOverdue && <div style={{ fontSize: 10, color: COLORS.criticalRed, fontWeight: 700 }}>OVERDUE</div>}
                      </td>

                      {/* Health */}
                      <td><StatusBadge value={p.healthIndicator} type="health" size="sm" /></td>

                      {/* Budget */}
                      <td><StatusBadge value={p.budgetStatus} type="budget" size="sm" /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add project modal */}
      {showForm && (
        <ProjectForm
          onSave={(data) => addProject({ ...data, domainId: domain.id, domainName: domain.name })}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
