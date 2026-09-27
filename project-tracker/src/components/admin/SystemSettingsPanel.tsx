import { useApp } from '../../context/AppContext'
import { useTeam } from '../../context/TeamContext'

export default function SystemSettingsPanel() {
  const { domains, projects } = useApp()
  const { users } = useTeam()

  const stats = [
    { label: 'Active Domains', value: domains.filter((d) => d.isActive).length },
    { label: 'Total Projects', value: projects.length },
    { label: 'Registered Users', value: users.length },
    { label: 'Roles Configured', value: 3 },
  ]

  return (
    <div>
      <div className="detail-section mb-6">
        <div className="detail-section-header">Platform Overview</div>
        <div className="detail-section-body">
          <div className="two-col-grid">
            {stats.map((s) => (
              <div key={s.label} className="stat-row">
                <span className="text-muted text-sm">{s.label}</span>
                <span style={{ fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="empty-state">
        <div className="text-sm text-muted">No configurable system settings yet — this section will grow as the platform does.</div>
      </div>
    </div>
  )
}
