import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CHART_HEALTH_DATA } from '../../data/mockData'
import { COLORS } from '../../constants/theme'

export default function HealthChart() {
  return (
    <div className="card p-6">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>Portfolio Health Trend</div>
        <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.successGreen, background: '#D9EAE7', padding: '2px 8px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: COLORS.successGreen, display: 'inline-block' }} />LIVE
        </span>
      </div>
      <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 20 }}>Monthly distribution of project health indicators</div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={CHART_HEALTH_DATA}>
          <defs>
            <linearGradient id="healthyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.successGreen} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.successGreen} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="atRiskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.warningOrange} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.warningOrange} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.criticalRed} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.criticalRed} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EFEFF1" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #EFEFF1', fontSize: 13 }} />
          <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{v}</span>} />
          <Area type="monotone" dataKey="healthy" name="Healthy" stroke={COLORS.successGreen} strokeWidth={2.5} fill="url(#healthyGrad)" isAnimationActive animationDuration={900} animationEasing="ease-out" />
          <Area type="monotone" dataKey="atRisk" name="At Risk" stroke={COLORS.warningOrange} strokeWidth={2.5} fill="url(#atRiskGrad)" isAnimationActive animationDuration={1100} animationEasing="ease-out" />
          <Area type="monotone" dataKey="critical" name="Critical" stroke={COLORS.criticalRed} strokeWidth={2.5} fill="url(#criticalGrad)" isAnimationActive animationDuration={1300} animationEasing="ease-out" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
