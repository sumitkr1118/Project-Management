import { Edit, Trash2, Users, FolderKanban, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Domain } from '../../types'
import { COLORS } from '../../constants/theme'

interface DomainCardProps {
  domain: Domain
  onEdit: (domain: Domain) => void
  onDelete: (id: string) => void
  onToggle: (id: string, active: boolean) => void
}

export default function DomainCard({ domain, onEdit, onDelete, onToggle }: DomainCardProps) {
  const navigate = useNavigate()

  return (
    <div
      className="card card-clickable"
      style={{ padding: 0, overflow: 'hidden', transition: 'all 0.2s ease' }}
      onClick={() => navigate(`/domains/${domain.id}`)}
    >
      {/* Color header */}
      <div style={{ height: 6, background: domain.color }} />

      <div style={{ padding: '20px 20px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: domain.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FolderKanban size={16} color={domain.color} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>{domain.name}</h3>
            </div>
            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: domain.isActive ? '#D9EAE7' : '#F2F3F3', color: domain.isActive ? COLORS.successGreen : COLORS.textSecondary }}>
              {domain.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={(e) => { e.stopPropagation(); onEdit(domain) }} className="btn-icon btn-sm" title="Edit domain">
              <Edit size={14} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(domain.id) }} className="btn-icon btn-sm" title="Delete domain" style={{ color: COLORS.criticalRed }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.5, marginBottom: 16, minHeight: 40 }}>
          {domain.description || 'No description provided.'}
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <FolderKanban size={13} color={COLORS.primaryBlue} />
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.primaryBlue }}>{domain.projectCount}</span>
            <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Projects</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Users size={13} color={COLORS.textSecondary} />
            <span style={{ fontSize: 12, color: COLORS.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{domain.owner}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #EFEFF1' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(domain.id, !domain.isActive) }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: domain.isActive ? COLORS.successGreen : COLORS.textSecondary }}
          >
            {domain.isActive ? <ToggleRight size={18} color={COLORS.successGreen} /> : <ToggleLeft size={18} color={COLORS.textSecondary} />}
            {domain.isActive ? 'Active' : 'Inactive'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: COLORS.primaryBlue, fontWeight: 600 }}>
            View Projects <ChevronRight size={14} color={COLORS.primaryBlue} />
          </div>
        </div>
      </div>
    </div>
  )
}
