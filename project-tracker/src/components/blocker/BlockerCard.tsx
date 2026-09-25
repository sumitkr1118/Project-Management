import { AlertTriangle, Calendar, User, Clock } from 'lucide-react'
import type { Blocker } from '../../types'
import { COLORS, BLOCKER_STATUS_COLORS, BLOCKER_STATUS_BG, SEVERITY_COLORS } from '../../constants/theme'
import StatusBadge from '../shared/StatusBadge'

interface BlockerCardProps {
  blocker: Blocker
  onUpdate: (id: string, status: Blocker['status']) => void
  onView: (blocker: Blocker) => void
}

const NEXT_STATUS: Record<string, Blocker['status']> = {
  'Open': 'In Progress',
  'In Progress': 'Resolved',
  'Resolved': 'Closed',
  'Escalated': 'In Progress',
  'Closed': 'Closed',
}

export default function BlockerCard({ blocker, onUpdate, onView }: BlockerCardProps) {
  const severityColor = SEVERITY_COLORS[blocker.severity]
  const isPastEta = new Date(blocker.eta) < new Date() && blocker.status !== 'Resolved' && blocker.status !== 'Closed'

  return (
    <div
      className="card"
      style={{ padding: 14, marginBottom: 10, borderLeft: `3px solid ${severityColor}`, cursor: 'pointer' }}
      onClick={() => onView(blocker)}
    >
      {/* Severity + Type */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <StatusBadge value={blocker.severity} type="severity" size="sm" />
          <span style={{ fontSize: 11, fontWeight: 600, background: '#F2F3F3', color: COLORS.textSecondary, padding: '2px 7px', borderRadius: 99 }}>
            {blocker.blockerType}
          </span>
        </div>
        {isPastEta && (
          <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.criticalRed, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={10} /> OVERDUE
          </span>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, lineHeight: 1.4, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {blocker.description}
      </p>

      {/* Project link */}
      <div style={{ fontSize: 11, color: COLORS.primaryBlue, fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
        <AlertTriangle size={11} color={COLORS.primaryBlue} />
        {blocker.projectName}
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: COLORS.textSecondary }}>
          <User size={11} />
          <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>{blocker.assignedOwner}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: isPastEta ? COLORS.criticalRed : COLORS.textSecondary }}>
          <Calendar size={11} />
          ETA: <span style={{ fontWeight: 600 }}>{blocker.eta}</span>
        </div>
      </div>

      {/* Action */}
      {blocker.status !== 'Closed' && blocker.status !== 'Resolved' && (
        <button
          onClick={(e) => { e.stopPropagation(); onUpdate(blocker.id, NEXT_STATUS[blocker.status]) }}
          style={{ width: '100%', padding: '6px', borderRadius: 6, border: `1.5px solid ${BLOCKER_STATUS_COLORS[NEXT_STATUS[blocker.status]]}`, background: BLOCKER_STATUS_BG[NEXT_STATUS[blocker.status]], color: BLOCKER_STATUS_COLORS[NEXT_STATUS[blocker.status]], fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
        >
          → {NEXT_STATUS[blocker.status]}
        </button>
      )}
    </div>
  )
}
