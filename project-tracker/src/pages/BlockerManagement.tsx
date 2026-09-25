import { useState } from 'react'
import { Plus, Search, AlertTriangle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { COLORS, BLOCKER_STATUS_COLORS } from '../constants/theme'
import BlockerCard from '../components/blocker/BlockerCard'
import BlockerForm from '../components/blocker/BlockerForm'
import type { Blocker, BlockerStatus } from '../types'

const COLUMNS: { status: BlockerStatus; label: string }[] = [
  { status: 'Open', label: 'Open' },
  { status: 'In Progress', label: 'In Progress' },
  { status: 'Escalated', label: 'Escalated' },
  { status: 'Resolved', label: 'Resolved' },
  { status: 'Closed', label: 'Closed' },
]

export default function BlockerManagement() {
  const { blockers, addBlocker, updateBlocker, projects } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editBlocker, setEditBlocker] = useState<Blocker | undefined>()
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [domainFilter, setDomainFilter] = useState<string>('all')

  const filtered = blockers.filter((b) => {
    const matchSearch = b.description.toLowerCase().includes(search.toLowerCase()) || b.projectName.toLowerCase().includes(search.toLowerCase()) || b.assignedOwner.toLowerCase().includes(search.toLowerCase())
    const matchSeverity = severityFilter === 'all' || b.severity === severityFilter
    if (domainFilter !== 'all') {
      const project = projects.find((p) => p.id === b.projectId)
      if (project?.domainId !== domainFilter) return false
    }
    return matchSearch && matchSeverity
  })

  const totalOpen = blockers.filter((b) => b.status === 'Open').length
  const totalEscalated = blockers.filter((b) => b.status === 'Escalated').length
  const totalCritical = blockers.filter((b) => b.severity === 'Critical').length

  const handleView = (blocker: Blocker) => { setEditBlocker(blocker); setShowForm(true) }
  const handleClose = () => { setShowForm(false); setEditBlocker(undefined) }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Blocker Management</h1>
          <p style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
            <span style={{ color: COLORS.criticalRed, fontWeight: 700 }}>{totalOpen} open</span> · <span style={{ color: '#6C47CC', fontWeight: 700 }}>{totalEscalated} escalated</span> · <span style={{ color: COLORS.criticalRed, fontWeight: 700 }}>{totalCritical} critical</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ background: COLORS.criticalRed }}>
          <Plus size={16} /> Raise Blocker
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
        {COLUMNS.map((col) => {
          const count = blockers.filter((b) => b.status === col.status).length
          const color = BLOCKER_STATUS_COLORS[col.status]
          return (
            <div key={col.status} className="card" style={{ padding: '14px 18px', borderTop: `3px solid ${color}`, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color }}>{count}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSecondary, marginTop: 2 }}>{col.label}</div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input className="search-input" placeholder="Search blockers, projects, owners..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: 'auto', padding: '9px 14px', fontSize: 13 }} value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
          <option value="all">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select className="form-input" style={{ width: 'auto', padding: '9px 14px', fontSize: 13 }} value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)}>
          <option value="all">All Domains</option>
          {[...new Set(projects.map((p) => ({ id: p.domainId, name: p.domainName })))].map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Kanban Board */}
      {filtered.length === 0 ? (
        <div className="card empty-state">
          <AlertTriangle size={40} color={COLORS.textSecondary} />
          <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.textPrimary, marginTop: 12 }}>No blockers found</div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary }}>
            {search || severityFilter !== 'all' ? 'Try adjusting your filters' : 'No blockers have been raised yet'}
          </div>
        </div>
      ) : (
        <div className="kanban-board">
          {COLUMNS.map((col) => {
            const colBlockers = filtered.filter((b) => b.status === col.status)
            const color = BLOCKER_STATUS_COLORS[col.status]
            return (
              <div key={col.status} className="kanban-column">
                <div className="kanban-column-header" style={{ color, borderBottomColor: color }}>
                  {col.label}
                  <span style={{ fontSize: 12, fontWeight: 700, background: color + '20', color, padding: '1px 8px', borderRadius: 99 }}>
                    {colBlockers.length}
                  </span>
                </div>
                {colBlockers.length === 0 ? (
                  <div style={{ textAlign: 'center', color: COLORS.textSecondary, fontSize: 12, padding: '20px 0', opacity: 0.6 }}>No blockers</div>
                ) : (
                  colBlockers.map((b) => (
                    <BlockerCard
                      key={b.id}
                      blocker={b}
                      onUpdate={(id, status) => updateBlocker(id, { status })}
                      onView={handleView}
                    />
                  ))
                )}
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <BlockerForm
          initial={editBlocker}
          onSave={(data) => {
            if (editBlocker) updateBlocker(editBlocker.id, data)
            else addBlocker(data)
          }}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
