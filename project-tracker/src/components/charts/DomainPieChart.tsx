import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CHART_DOMAIN_DATA } from '../../data/mockData'
import { COLORS } from '../../constants/theme'

export default function DomainPieChart() {
  return (
    <div className="card p-6">
      <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 6 }}>Projects by Domain</div>
      <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 20 }}>Portfolio distribution across all active domains</div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={CHART_DOMAIN_DATA}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {CHART_DOMAIN_DATA.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value} projects`, name]}
            contentStyle={{ borderRadius: 8, border: '1px solid #EFEFF1', fontSize: 13 }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
