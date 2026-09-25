import { useNavigate } from 'react-router-dom'
import { Calendar, User, AlertTriangle, ChevronRight, TrendingUp } from 'lucide-react'
import type { Project } from '../../types'
import { COLORS, STATUS_COLORS } from '../../constants/theme'
import StatusBadge from '../shared/StatusBadge'
import ProgressBar from '../shared/ProgressBar'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate()
  const statusColor = STATUS_COLORS[project.status]

  return (
    <div
      className="card card-clickable"
      style={{ padding: 0, overflow: 'hidden' }}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Status bar */}
      <div style={{ height: 4, background: statusColor }} />

      <div style={{ padding: '18px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.primaryBlue, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: project.domainId ? '#0469A820' : 'transparent', border: '1.5px solid #0469A8' }} />
              {project.domainName}
              {project.subDomain && <span style={{ color: COLORS.textSecondary }}>· {project.subDomain}</span>}
            </div>
            <span style={{ fontSize: 11, color: COLORS.textSecondary }}>{project.projectId}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <StatusBadge value={project.status} type="status" size="sm" />
            {project.escalationStatus && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 700, color: COLORS.criticalRed, background: '#F3D9DE', padding: '2px 6px', borderRadius: 99 }}>
                <AlertTriangle size={9} />ESC
              </span>
            )}
          </div>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 6, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.name}
        </h3>

        <p style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description}
        </p>

        {/* Progress */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Completion</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={12} color={COLORS.primaryBlue} />
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.primaryBlue }}>{project.completionPercentage}%</span>
            </div>
          </div>
          <ProgressBar value={project.completionPercentage} size="sm" />
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textSecondary }}>
            <User size={12} />
            <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>{project.projectManager}</span>
            <span>· PM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textSecondary }}>
            <Calendar size={12} />
            Go-Live: <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>{project.goLiveDate}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #EFEFF1' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <StatusBadge value={project.priority} type="priority" size="sm" />
            <StatusBadge value={project.riskLevel} type="risk" size="sm" />
          </div>
          <ChevronRight size={16} color={COLORS.textSecondary} />
        </div>
      </div>
    </div>
  )
}
