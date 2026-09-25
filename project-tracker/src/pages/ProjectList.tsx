import { useState } from 'react'
import { Plus, Search, FolderKanban, LayoutGrid, List } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { COLORS } from '../constants/theme'
import ProjectCard from '../components/project/ProjectCard'
import ProjectForm from '../components/project/ProjectForm'
import StatusBadge from '../components/shared/StatusBadge'
import ProgressBar from '../components/shared/ProgressBar'
import { useNavigate } from 'react-router-dom'
import type { Project } from '../types'

export default function ProjectList() {
  const { projects, domains, addProject, selectedDomainFilter } = useApp()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [domainFilter, setDomainFilter] = useState(selectedDomainFilter)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'goLive' | 'completion' | 'status'>('status')

  const filtered = projects
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.projectId.toLowerCase().includes(search.toLowerCase()) || p.projectManager.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || p.status === statusFilter
      const matchPriority = priorityFilter === 'all' || p.priority === priorityFilter
      const matchDomain = domainFilter === 'all' || p.domainId === domainFilter
      return matchSearch && matchStatus && matchPriority && matchDomain
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'goLive') return a.goLiveDate.localeCompare(b.goLiveDate)
      if (sortBy === 'completion') return b.completionPercentage - a.completionPercentage
      // Sort by status: Breached > Delayed > On Track
      const order = { 'Breached': 0, 'Delayed': 1, 'On Track': 2 }
      return (order[a.status] ?? 3) - (order[b.status] ?? 3)
    })

  const totalOn = projects.filter((p) => p.status === 'On Track').length
  const totalDelayed = projects.filter((p) => p.status === 'Delayed').length
  const totalBreached = projects.filter((p) => p.status === 'Breached').length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 className="page-title">All Projects</h1>
          <p style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
            {projects.length} projects · <span style={{ color: COLORS.successGreen, fontWeight: 600 }}>{totalOn} on track</span> · <span style={{ color: COLORS.warningOrange, fontWeight: 600 }}>{totalDelayed} delayed</span> · <span style={{ color: COLORS.criticalRed, fontWeight: 600 }}>{totalBreached} breached</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Onboard Project
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input className="search-input" placeholder="Search projects, IDs, managers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <select className="form-input" style={{ width: 'auto', padding: '9px 14px', fontSize: 13 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="On Track">On Track</option>
          <option value="Delayed">Delayed</option>
          <option value="Breached">Breached</option>
        </select>

        <select className="form-input" style={{ width: 'auto', padding: '9px 14px', fontSize: 13 }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">All Priority</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select className="form-input" style={{ width: 'auto', padding: '9px 14px', fontSize: 13 }} value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)}>
          <option value="all">All Domains</option>
          {domains.filter((d) => d.isActive).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        <select className="form-input" style={{ width: 'auto', padding: '9px 14px', fontSize: 13 }} value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
          <option value="status">Sort: Status</option>
          <option value="name">Sort: Name</option>
          <option value="goLive">Sort: Go-Live</option>
          <option value="completion">Sort: Completion</option>
        </select>

        <div style={{ display: 'flex', gap: 4, border: '1.5px solid #EFEFF1', borderRadius: 8, padding: 3, background: COLORS.white }}>
          <button onClick={() => setViewMode('grid')} style={{ padding: '5px 8px', borderRadius: 6, border: 'none', background: viewMode === 'grid' ? COLORS.primaryBlue : 'transparent', color: viewMode === 'grid' ? COLORS.white : COLORS.textSecondary, cursor: 'pointer' }}>
            <LayoutGrid size={15} />
          </button>
          <button onClick={() => setViewMode('list')} style={{ padding: '5px 8px', borderRadius: 6, border: 'none', background: viewMode === 'list' ? COLORS.primaryBlue : 'transparent', color: viewMode === 'list' ? COLORS.white : COLORS.textSecondary, cursor: 'pointer' }}>
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 }}>
        Showing <strong style={{ color: COLORS.textPrimary }}>{filtered.length}</strong> of {projects.length} projects
      </div>

      {/* Project Grid / List */}
      {filtered.length === 0 ? (
        <div className="card empty-state">
          <FolderKanban size={40} color={COLORS.textSecondary} />
          <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.textPrimary, marginTop: 12 }}>No projects match</div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary }}>Try adjusting your filters</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="projects-grid">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Domain</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Health</th>
                  <th>Progress</th>
                  <th>Go-Live</th>
                  <th>PM</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: Project) => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/projects/${p.id}`)}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.textPrimary }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{p.projectId}</div>
                    </td>
                    <td style={{ fontSize: 13, color: COLORS.textSecondary }}>{p.domainName}</td>
                    <td><StatusBadge value={p.status} type="status" size="sm" /></td>
                    <td><StatusBadge value={p.priority} type="priority" size="sm" /></td>
                    <td><StatusBadge value={p.healthIndicator} type="health" size="sm" /></td>
                    <td style={{ minWidth: 130 }}><ProgressBar value={p.completionPercentage} size="sm" showLabel /></td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, whiteSpace: 'nowrap' }}>{p.goLiveDate}</td>
                    <td style={{ fontSize: 13, color: COLORS.textSecondary, whiteSpace: 'nowrap' }}>{p.projectManager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <ProjectForm
          onSave={(data) => addProject(data)}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
