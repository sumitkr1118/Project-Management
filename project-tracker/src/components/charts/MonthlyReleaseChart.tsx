import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { CHART_RELEASE_DATA } from '../../data/mockData'
import { COLORS } from '../../constants/theme'

export default function MonthlyReleaseChart() {
  return (
    <div className="card p-6">
      <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 6 }}>Monthly Release Pipeline</div>
      <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 20 }}>Planned go-lives by month across all domains</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={CHART_RELEASE_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EFEFF1" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #EFEFF1', fontSize: 13 }}
            formatter={(v: number) => [`${v} releases`, 'Go-Lives']}
            cursor={{ fill: '#F2F3F3' }}
          />
          <Bar dataKey="releases" radius={[6, 6, 0, 0]} maxBarSize={40} isAnimationActive animationDuration={800} animationEasing="ease-out">
            {CHART_RELEASE_DATA.map((_, i) => (
              <Cell key={i} fill={i === 6 ? COLORS.goldAccent : COLORS.primaryBlue} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 }}>
        <span style={{ color: COLORS.goldAccent, fontWeight: 700 }}>■</span> Jun 25 — Peak release month (4 go-lives)
      </div>
    </div>
  )
}
