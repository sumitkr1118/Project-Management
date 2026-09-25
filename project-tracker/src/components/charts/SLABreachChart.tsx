import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CHART_SLA_DATA } from '../../data/mockData'
import { COLORS } from '../../constants/theme'

export default function SLABreachChart() {
  return (
    <div className="card p-6">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>SLA Compliance Trend</div>
        <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.successGreen, background: '#D9EAE7', padding: '2px 8px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: COLORS.successGreen, display: 'inline-block' }} />LIVE
        </span>
      </div>
      <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 20 }}>Monthly SLA compliance vs breach count</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={CHART_SLA_DATA} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EFEFF1" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #EFEFF1', fontSize: 13 }}
            cursor={{ fill: '#F2F3F3' }}
          />
          <Legend iconType="square" iconSize={10} formatter={(v) => <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{v}</span>} />
          <Bar dataKey="compliant" name="Compliant" fill={COLORS.successGreen} radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive animationDuration={800} animationEasing="ease-out" />
          <Bar dataKey="breached" name="Breached" fill={COLORS.criticalRed} radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive animationDuration={1000} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
