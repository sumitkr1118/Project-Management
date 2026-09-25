import {
  BarChart2, CheckCircle2, XCircle, AlertOctagon,
  Rocket, ShieldAlert, ClipboardList, Target,
  ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { COLORS, BLOCKER_STATUS_COLORS } from '../constants/theme'
import KPICard from '../components/shared/KPICard'
import StatusBadge from '../components/shared/StatusBadge'
import DomainPieChart from '../components/charts/DomainPieChart'
import SLABreachChart from '../components/charts/SLABreachChart'
import MonthlyReleaseChart from '../components/charts/MonthlyReleaseChart'
import ProgressBar from '../components/shared/ProgressBar'
import { useState, useEffect } from 'react'

export default function ExecutiveDashboard() {
  const { projects, blockers, domains } = useApp()
  const navigate = useNavigate()
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [pulse, setPulse] = useState(true)
  const [chartKey] = useState(Date.now)

  useEffect(() => {
    const tick = setInterval(() => {
      setLastUpdated(new Date())
      setPulse((p) => !p)
    }, 30000)
    return () => clearInterval(tick)
  }, [])

  const today = new Date()
  const nextMonth = new Date(today); nextMonth.setDate(today.getDate() + 30)

  const totalProjects = projects.length
  const onTrack = projects.filter((p) => p.status === 'On Track').length
  const delayed = projects.filter((p) => p.status === 'Delayed').length
  const breached = projects.filter((p) => p.status === 'Breached').length
  const upcomingGoLives = projects.filter((p) => { const d = new Date(p.goLiveDate); return d >= today && d <= nextMonth }).length
  const highRisk = projects.filter((p) => p.riskLevel === 'High').length
  const pendingUAT = projects.filter((p) => new Date(p.uatStartDate) <= today && p.completionPercentage < 80 && p.status !== 'Breached').length
  const slaCompliant = projects.filter((p) => p.slaCompliance).length
  const slaPercentage = Math.round((slaCompliant / totalProjects) * 100)

  const criticalBlockers = blockers.filter((b) => (b.severity === 'Critical' || b.severity === 'High') && b.status !== 'Closed' && b.status !== 'Resolved')
  const openBlockers = blockers.filter((b) => b.status === 'Open' || b.status === 'Escalated').length

  const avgCompletion = Math.round(projects.reduce((sum, p) => sum + p.completionPercentage, 0) / totalProjects)

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ background: `linear-gradient(135deg, #007560 0%, #004937 100%)`, borderRadius: 14, padding: '24px 28px', marginBottom: 28, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Portfolio Governance</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.15)', padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7FC9BB', display: 'inline-block', boxShadow: pulse ? '0 0 0 4px rgba(127,201,187,0.3)' : '0 0 0 0px rgba(127,201,187,0)', transition: 'box-shadow 1s ease' }} />
              LIVE
            </span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.3px' }}>Project Governance Dashboard</h2>
          <div style={{ fontSize: 13, opacity: 0.75 }}>
            {totalProjects} active projects across {domains.filter((d) => d.isActive).length} domains · {openBlockers} open blockers · Updated {lastUpdated.toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.goldAccent }}>{avgCompletion}%</div>
            <div style={{ fontSize: 11, opacity: 0.75 }}>Avg Completion</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: slaPercentage >= 80 ? '#7FC9BB' : '#CF6679' }}>{slaPercentage}%</div>
            <div style={{ fontSize: 11, opacity: 0.75 }}>SLA Compliance</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard label="Total Projects" value={totalProjects} icon={BarChart2} accentColor={COLORS.primaryBlue} subtitle="Active portfolio" />
        <KPICard label="On Track" value={onTrack} icon={CheckCircle2} accentColor={COLORS.successGreen} trend={5} subtitle="vs last month" />
        <KPICard label="Delayed" value={delayed} icon={AlertOctagon} accentColor={COLORS.warningOrange} trend={-10} subtitle="vs last month" />
        <KPICard label="Breached" value={breached} icon={XCircle} accentColor={COLORS.criticalRed} subtitle="SLA breached" />
        <KPICard label="Upcoming Go-Lives" value={upcomingGoLives} unit="(30d)" icon={Rocket} accentColor={COLORS.goldAccent} subtitle="Next 30 days" />
        <KPICard label="High Risk" value={highRisk} icon={ShieldAlert} accentColor={COLORS.criticalRed} subtitle="Needs attention" />
        <KPICard label="Pending UAT" value={pendingUAT} icon={ClipboardList} accentColor="#6C47CC" subtitle="Awaiting sign-off" />
        <KPICard label="SLA Compliance" value={slaPercentage} unit="%" icon={Target} accentColor={slaPercentage >= 80 ? COLORS.successGreen : COLORS.criticalRed} subtitle={`${slaCompliant}/${totalProjects} projects`} />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        <SLABreachChart key={chartKey} />
        <DomainPieChart />
      </div>

      {/* Charts Row 2 */}
      <div style={{ marginBottom: 28 }}>
        <MonthlyReleaseChart />
      </div>

      {/* Bottom Row: Critical Blockers + Domain Summary */}
      <div className="charts-grid">
        {/* Critical Blockers */}
        <div className="card p-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>Critical & High Blockers</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Requires immediate attention</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/blockers')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              View All <ArrowRight size={13} />
            </button>
          </div>
          {criticalBlockers.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={32} color={COLORS.successGreen} className="empty-state-icon" />
              <div style={{ fontWeight: 600, color: COLORS.textPrimary }}>No critical blockers</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary }}>All high-priority blockers resolved</div>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalBlockers.map((b) => (
                    <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/blockers')}>
                      <td style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, maxWidth: 160 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.projectName}</div>
                      </td>
                      <td><StatusBadge value={b.severity} type="severity" size="sm" /></td>
                      <td>
                        <span style={{ fontSize: 11, fontWeight: 600, color: BLOCKER_STATUS_COLORS[b.status], background: BLOCKER_STATUS_COLORS[b.status] + '18', padding: '2px 8px', borderRadius: 99 }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: COLORS.textSecondary }}>{b.assignedOwner}</td>
                      <td>
                        <span style={{ fontSize: 12, fontWeight: 600, color: new Date(b.eta) < new Date() ? COLORS.criticalRed : COLORS.textPrimary }}>
                          {b.eta}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Domain Summary */}
        <div className="card p-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>Domain Health Summary</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Portfolio overview by domain</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/domains')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Manage <ArrowRight size={13} />
            </button>
          </div>
          {domains.filter((d) => d.isActive).map((domain) => {
            const domainProjects = projects.filter((p) => p.domainId === domain.id)
            const domainBreached = domainProjects.filter((p) => p.status === 'Breached').length
            const domainDelayed = domainProjects.filter((p) => p.status === 'Delayed').length
            const avgComp = domainProjects.length > 0 ? Math.round(domainProjects.reduce((s, p) => s + p.completionPercentage, 0) / domainProjects.length) : 0
            return (
              <div key={domain.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #EFEFF1' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: domain.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{domain.name}</span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {domainBreached > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.criticalRed }}>⚠ {domainBreached} breached</span>}
                      {domainDelayed > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.warningOrange }}>{domainDelayed} delayed</span>}
                      <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textSecondary }}>{avgComp}%</span>
                    </div>
                  </div>
                  <ProgressBar value={avgComp} size="sm" color={domain.color} />
                </div>
                <span style={{ fontSize: 12, color: COLORS.textSecondary, flexShrink: 0 }}>{domain.projectCount}p</span>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
