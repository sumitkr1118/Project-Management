import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { COLORS } from '../../constants/theme'

interface KPICardProps {
  label: string
  value: number | string
  unit?: string
  icon: LucideIcon
  accentColor: string
  trend?: number
  subtitle?: string
}

export default function KPICard({ label, value, unit, icon: Icon, accentColor, trend, subtitle }: KPICardProps) {
  const isPositiveTrend = trend !== undefined && trend >= 0

  return (
    <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, borderLeft: `4px solid ${accentColor}`, position: 'relative', overflow: 'hidden' }}>
      {/* Background accent */}
      <div style={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', background: accentColor, opacity: 0.06 }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          {label}
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: accentColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={18} color={accentColor} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textSecondary, marginBottom: 3 }}>{unit}</span>}
      </div>

      {(subtitle || trend !== undefined) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {trend !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: isPositiveTrend ? COLORS.successGreen : COLORS.criticalRed }}>
              {isPositiveTrend ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(trend)}%
            </span>
          )}
          {subtitle && <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{subtitle}</span>}
        </div>
      )}
    </div>
  )
}
