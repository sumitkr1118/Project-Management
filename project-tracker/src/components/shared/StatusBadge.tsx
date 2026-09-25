import { STATUS_COLORS, STATUS_BG, PRIORITY_COLORS, PRIORITY_BG, SEVERITY_COLORS, BLOCKER_STATUS_COLORS, BLOCKER_STATUS_BG, HEALTH_COLORS, RISK_COLORS, ROLE_COLORS } from '../../constants/theme'

interface StatusBadgeProps {
  value: string
  type?: 'status' | 'priority' | 'severity' | 'blockerStatus' | 'health' | 'risk' | 'budget' | 'role' | 'generic'
  size?: 'sm' | 'md'
}

function getBadgeColors(value: string, type: string): { bg: string; color: string } {
  switch (type) {
    case 'status':
      return { bg: STATUS_BG[value] ?? '#F2F3F3', color: STATUS_COLORS[value] ?? '#6F6F6F' }
    case 'priority':
      return { bg: PRIORITY_BG[value] ?? '#F2F3F3', color: PRIORITY_COLORS[value] ?? '#6F6F6F' }
    case 'severity':
      return { bg: value === 'Critical' ? '#F3D9DE' : value === 'High' ? '#F3E6DD' : value === 'Medium' ? '#F3E6DD' : '#F2F3F3', color: SEVERITY_COLORS[value] ?? '#6F6F6F' }
    case 'blockerStatus':
      return { bg: BLOCKER_STATUS_BG[value] ?? '#F2F3F3', color: BLOCKER_STATUS_COLORS[value] ?? '#6F6F6F' }
    case 'health':
      return { bg: value === 'Healthy' ? '#D9EAE7' : value === 'At Risk' ? '#F3E6DD' : '#F3D9DE', color: HEALTH_COLORS[value] ?? '#6F6F6F' }
    case 'risk':
      return { bg: value === 'High' ? '#F3D9DE' : value === 'Medium' ? '#F3E6DD' : '#D9EAE7', color: RISK_COLORS[value] ?? '#6F6F6F' }
    case 'budget':
      return { bg: value === 'On Budget' ? '#D9EAE7' : value === 'Over Budget' ? '#F3D9DE' : '#DAEBF6', color: value === 'On Budget' ? '#007560' : value === 'Over Budget' ? '#B00020' : '#0469A8' }
    case 'role':
      return { bg: '#F2F3F3', color: ROLE_COLORS[value] ?? '#6F6F6F' }
    default:
      return { bg: '#F2F3F3', color: '#6F6F6F' }
  }
}

export default function StatusBadge({ value, type = 'generic', size = 'md' }: StatusBadgeProps) {
  const { bg, color } = getBadgeColors(value, type)
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: size === 'sm' ? '2px 8px' : '4px 10px',
      borderRadius: 99,
      fontSize: size === 'sm' ? 11 : 12,
      fontWeight: 700,
      background: bg,
      color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: size === 'sm' ? 5 : 6, height: size === 'sm' ? 5 : 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
      {value}
    </span>
  )
}
