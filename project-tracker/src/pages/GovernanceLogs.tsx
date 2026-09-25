import { useState } from 'react'
import { Search, FileText, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { COLORS } from '../constants/theme'

const ENTITY_COLORS: Record<string, string> = {
  Project: COLORS.primaryBlue,
  Domain: COLORS.successGreen,
  Blocker: COLORS.criticalRed,
  Risk: COLORS.warningOrange,
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts)
  return d.toLocaleString('en-AE', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function GovernanceLogs() {
  const { governanceLogs } = useApp()
  const [search, setSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [actionFilter, setActionFilter] = useState<string>('all')

  const filtered = governanceLogs.filter((log) => {
    const matchSearch =
      log.entityName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(search.toLowerCase())
    const matchEntity = entityFilter === 'all' || log.entityType === entityFilter
    const matchAction = actionFilter === 'all' || log.action.includes(actionFilter)
    return matchSearch && matchEntity && matchAction
  })

  const uniqueActions = [...new Set(governanceLogs.map((l) => l.action))]

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Entity Type', 'Entity Name', 'Action', 'Performed By', 'Changes'].join(','),
      ...filtered.map((l) => [l.timestamp, l.entityType, `"${l.entityName}"`, `"${l.action}"`, l.performedBy, `"${l.changes}"`].join(',')),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'governance-log.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Governance Logs</h1>
          <p style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
            Complete audit trail — {governanceLogs.length} total entries
          </p>
        </div>
        <button className="btn btn-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {(['Project', 'Domain', 'Blocker', 'Risk'] as const).map((type) => {
          const count = governanceLogs.filter((l) => l.entityType === type).length
          const color = ENTITY_COLORS[type]
          return (
            <div key={type} className="card" style={{ padding: '16px 20px', borderLeft: `4px solid ${color}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{type} Changes</div>
              <div style={{ fontSize: 26, fontWeight: 800, color }}>{count}</div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input className="search-input" placeholder="Search by entity, action, or user..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: 'auto', padding: '9px 14px', fontSize: 13 }} value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}>
          <option value="all">All Entities</option>
          <option value="Project">Project</option>
          <option value="Domain">Domain</option>
          <option value="Blocker">Blocker</option>
          <option value="Risk">Risk</option>
        </select>
        <select className="form-input" style={{ width: 'auto', padding: '9px 14px', fontSize: 13 }} value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
          <option value="all">All Actions</option>
          {uniqueActions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Logs */}
      <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 }}>
        Showing <strong style={{ color: COLORS.textPrimary }}>{filtered.length}</strong> of {governanceLogs.length} entries
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <FileText size={40} color={COLORS.textSecondary} />
          <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.textPrimary, marginTop: 12 }}>No logs found</div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary }}>Try adjusting your filters</div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Type</th>
                  <th>Entity</th>
                  <th>Action</th>
                  <th>Performed By</th>
                  <th>Changes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: 12, color: COLORS.textSecondary, whiteSpace: 'nowrap' }}>
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: ENTITY_COLORS[log.entityType] + '18', color: ENTITY_COLORS[log.entityType] }}>
                        {log.entityType}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, maxWidth: 180 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.entityName}</div>
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: COLORS.primaryBlue, whiteSpace: 'nowrap' }}>
                      {log.action}
                    </td>
                    <td style={{ fontSize: 13, color: COLORS.textSecondary, whiteSpace: 'nowrap' }}>
                      {log.performedBy}
                    </td>
                    <td style={{ fontSize: 12, color: COLORS.textSecondary, maxWidth: 260 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.changes}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
