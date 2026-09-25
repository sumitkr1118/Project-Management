import { useState } from 'react'
import { Plus, Building2, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { COLORS } from '../constants/theme'
import DomainCard from '../components/domain/DomainCard'
import DomainForm from '../components/domain/DomainForm'
import type { Domain } from '../types'

export default function DomainManagement() {
  const { domains, addDomain, updateDomain, deleteDomain } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editDomain, setEditDomain] = useState<Domain | undefined>()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const filtered = domains.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.owner.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'active' ? d.isActive : !d.isActive)
    return matchSearch && matchFilter
  })

  const handleEdit = (domain: Domain) => { setEditDomain(domain); setShowForm(true) }
  const handleClose = () => { setShowForm(false); setEditDomain(undefined) }

  const handleSave = (data: Omit<Domain, 'id' | 'createdAt' | 'updatedAt' | 'projectCount'>) => {
    if (editDomain) {
      updateDomain(editDomain.id, data)
    } else {
      addDomain(data)
    }
  }

  const activeDomains = domains.filter((d) => d.isActive).length
  const totalProjects = domains.reduce((sum, d) => sum + d.projectCount, 0)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Domain Management</h1>
          <p style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
            {activeDomains} active domains · {totalProjects} total projects across portfolio
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Domain
        </button>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Domains', value: domains.length, color: COLORS.primaryBlue },
          { label: 'Active Domains', value: activeDomains, color: COLORS.successGreen },
          { label: 'Inactive Domains', value: domains.length - activeDomains, color: COLORS.textSecondary },
          { label: 'Total Projects', value: totalProjects, color: COLORS.warningOrange },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ padding: '16px 20px', borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search domains or owners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="btn btn-sm"
              style={{ background: filter === f ? COLORS.primaryBlue : COLORS.white, color: filter === f ? COLORS.white : COLORS.textSecondary, border: `1.5px solid ${filter === f ? COLORS.primaryBlue : COLORS.borderColor}`, textTransform: 'capitalize' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Grid */}
      {filtered.length === 0 ? (
        <div className="card empty-state">
          <Building2 size={40} color={COLORS.textSecondary} className="empty-state-icon" />
          <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.textPrimary }}>No domains found</div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>
            {search ? 'Try adjusting your search.' : 'Add your first domain to get started.'}
          </div>
          {!search && (
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowForm(true)}>
              <Plus size={15} /> Add Domain
            </button>
          )}
        </div>
      ) : (
        <div className="domain-grid">
          {filtered.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              onEdit={handleEdit}
              onDelete={deleteDomain}
              onToggle={(id, active) => updateDomain(id, { isActive: active })}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <DomainForm
          initial={editDomain}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
