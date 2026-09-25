import { COLORS } from '../../constants/theme'

interface ProgressBarProps {
  value: number
  size?: 'sm' | 'md'
  showLabel?: boolean
  color?: string
}

function getColor(value: number): string {
  if (value >= 80) return COLORS.successGreen
  if (value >= 50) return COLORS.primaryBlue
  if (value >= 30) return COLORS.warningOrange
  return COLORS.criticalRed
}

export default function ProgressBar({ value, size = 'md', showLabel = false, color }: ProgressBarProps) {
  const barColor = color ?? getColor(value)
  const height = size === 'sm' ? 5 : 8

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height, background: '#EFEFF1', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, value)}%`, background: barColor, borderRadius: 99, transition: 'width 0.5s ease' }} />
      </div>
      {showLabel && (
        <span style={{ fontSize: 13, fontWeight: 700, color: barColor, minWidth: 34, textAlign: 'right' }}>{value}%</span>
      )}
    </div>
  )
}
