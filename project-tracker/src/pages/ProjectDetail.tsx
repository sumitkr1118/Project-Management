import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ChevronRight, Edit, Plus, AlertTriangle, Shield,
  Target, Calendar, BarChart2, Users, FileText,
  CheckCircle, XCircle, Clock,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { COLORS, STATUS_COLORS, STATUS_BG } from '../constants/theme'
import StatusBadge from '../components/shared/StatusBadge'
import ProgressBar from '../components/shared/ProgressBar'
import ProjectTimeline from '../components/project/ProjectTimeline'
import TeamSection from '../components/project/TeamSection'
import ProjectForm from '../components/project/ProjectForm'
import BlockerForm from '../components/blocker/BlockerForm'
import BlockerCard from '../components/blocker/BlockerCard'
import type { Blocker, ProjectStatus } from '../types'
import { MOCK_RISKS } from '../data/mockData'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getProjectById, getBlockersByProject, updateProject, addBlocker, updateBlocker } = useApp()

  const project = getProjectById(id!)
  const projectBlockers = getBlockersByProject(id!)
  const projectRisks = MOCK_RISKS.filter((r) => r.projectId === id)

  const [showEdit, setShowEdit] = useState(false)
  const [showBlockerForm, setShowBlockerForm] = useState(false)
  const [viewBlocker, setViewBlocker] = useState<Blocker | undefined>()

  if (!project) {
    return (
      <div className="empty-state" style={{ marginTop: 60 }}>
        <XCircle size={48} color={COLORS.criticalRed} />
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary, marginTop: 12 }}>Project not found</div>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/projects')}>
          Back to Projects
        </button>
      </div>
    )
  }

  const statusColor = STATUS_COLORS[project.status]
  const openBlockers = projectBlockers.filter((b) => b.status !== 'Closed' && b.status !== 'Resolved').length

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/projects')}>Projects</span>
        <ChevronRight size={13} className="breadcrumb-sep" />
        <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>{project.name}</span>
      </div>

      {/* Project Header Banner */}
      <div style={{ background: COLORS.white, borderRadius: 14, padding: '24px 28px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: `6px solid ${statusColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.primaryBlue, background: '#DAEBF6', padding: '3px 10px', borderRadius: 99 }}>{project.projectId}</span>
              <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{project.domainName}</span>
              {project.subDomain && <span style={{ fontSize: 12, color: COLORS.textSecondary }}>· {project.subDomain}</span>}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 8, letterSpacing: '-0.3px' }}>{project.name}</h1>
            <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, maxWidth: 700 }}>{project.description}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginLeft: 20 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowEdit(true)}>
              <Edit size={14} /> Edit Project
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginTop: 20, paddingTop: 20, borderTop: '1px solid #EFEFF1' }}>
          {[
            { label: 'Status', value: (
              <select
                value={project.status}
                onChange={(e) => updateProject(project.id, { status: e.target.value as ProjectStatus })}
                style={{ border: 'none', background: STATUS_BG[project.status] ?? '#F2F3F3', color: STATUS_COLORS[project.status] ?? COLORS.primaryBlue, padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none', appearance: 'none', WebkitAppearance: 'none' }}
              >
                <option value="On Track">On Track</option>
                <option value="Delayed">Delayed</option>
                <option value="Breached">Breached</option>
              </select>
            ) },
            { label: 'Health', value: <StatusBadge value={project.healthIndicator} type="health" /> },
            { label: 'Priority', value: <StatusBadge value={project.priority} type="priority" /> },
            { label: 'Completion', value: <strong style={{ color: COLORS.primaryBlue, fontSize: 16 }}>{project.completionPercentage}%</strong> },
            { label: 'Go-Live', value: <strong style={{ color: new Date(project.goLiveDate) < new Date() && project.status !== 'On Track' ? COLORS.criticalRed : COLORS.textPrimary, fontSize: 14 }}>{project.goLiveDate}</strong> },
            { label: 'Methodology', value: <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{project.deliveryMethodology}</span> },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{item.label}</div>
              {item.value}
            </div>
          ))}
        </div>

        {/* Progress bar with stepper */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Overall Completion</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => updateProject(project.id, { completionPercentage: Math.max(0, project.completionPercentage - 5) })}
                disabled={project.completionPercentage <= 0}
                style={{ width: 28, height: 28, borderRadius: 6, border: '1.5px solid #D7D7DF', background: 'white', color: COLORS.textPrimary, fontSize: 16, fontWeight: 700, cursor: project.completionPercentage <= 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: project.completionPercentage <= 0 ? 0.4 : 1 }}
              >−</button>
              <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.primaryBlue, minWidth: 44, textAlign: 'center' }}>{project.completionPercentage}%</span>
              <button
                onClick={() => updateProject(project.id, { completionPercentage: Math.min(100, project.completionPercentage + 5) })}
                disabled={project.completionPercentage >= 100}
                style={{ width: 28, height: 28, borderRadius: 6, border: '1.5px solid #D7D7DF', background: 'white', color: COLORS.textPrimary, fontSize: 16, fontWeight: 700, cursor: project.completionPercentage >= 100 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: project.completionPercentage >= 100 ? 0.4 : 1 }}
              >+</button>
              <span style={{ fontSize: 11, color: COLORS.textSecondary, marginLeft: 2 }}>±5%</span>
            </div>
          </div>
          <ProgressBar value={project.completionPercentage} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        <div>
          {/* A. Timeline */}
          <div className="detail-section">
            <div className="detail-section-header" style={{ color: COLORS.primaryBlue }}>
              <Calendar size={18} color={COLORS.primaryBlue} />
              Timeline Tracker
            </div>
            <div className="detail-section-body">
              <ProjectTimeline project={project} onUpdate={(updates) => updateProject(project.id, updates)} />
            </div>
          </div>

          {/* D. Governance & SLA */}
          <div className="detail-section">
            <div className="detail-section-header" style={{ color: COLORS.warningOrange }}>
              <Target size={18} color={COLORS.warningOrange} />
              Governance & SLA
            </div>
            <div className="detail-section-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[
                  { label: 'SLA Target', value: `${project.slaTarget}%`, color: COLORS.textPrimary },
                  { label: 'SLA Compliance', value: project.slaCompliance ? '✓ Compliant' : '✗ Non-Compliant', color: project.slaCompliance ? COLORS.successGreen : COLORS.criticalRed },
                  { label: 'Delay Count', value: `${project.delayCount} delays`, color: project.delayCount > 0 ? COLORS.warningOrange : COLORS.successGreen },
                  { label: 'Escalation Status', value: project.escalationStatus ? '🔴 Escalated' : '✓ Normal', color: project.escalationStatus ? COLORS.criticalRed : COLORS.successGreen },
                  { label: 'Budget Status', value: project.budgetStatus, color: project.budgetStatus === 'Over Budget' ? COLORS.criticalRed : project.budgetStatus === 'On Budget' ? COLORS.successGreen : COLORS.primaryBlue },
                ].map((item) => (
                  <div key={item.label} style={{ padding: '12px 16px', background: '#F2F3F3', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {project.governanceRemarks && (
                <div style={{ padding: '12px 16px', background: '#DAEBF6', borderRadius: 8, borderLeft: `3px solid ${COLORS.primaryBlue}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.primaryBlue, marginBottom: 4 }}>Governance Remarks</div>
                  <div style={{ fontSize: 13, color: COLORS.textPrimary, lineHeight: 1.5 }}>{project.governanceRemarks}</div>
                </div>
              )}
            </div>
          </div>

          {/* E. Risks & Dependencies */}
          <div className="detail-section">
            <div className="detail-section-header" style={{ color: COLORS.criticalRed }}>
              <Shield size={18} color={COLORS.criticalRed} />
              Risks & Dependencies
            </div>
            <div className="detail-section-body">
              {projectRisks.length === 0 ? (
                <div style={{ textAlign: 'center', color: COLORS.textSecondary, padding: '20px 0' }}>
                  <CheckCircle size={28} color={COLORS.successGreen} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 13 }}>No risks registered for this project</div>
                </div>
              ) : (
                projectRisks.map((risk) => (
                  <div key={risk.id} style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid #EFEFF1', marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <StatusBadge value={risk.impact} type="risk" size="sm" />
                        <span style={{ fontSize: 11, fontWeight: 600, background: '#F2F3F3', padding: '2px 7px', borderRadius: 99, color: COLORS.textSecondary }}>
                          Prob: {risk.probability}
                        </span>
                      </div>
                      <StatusBadge value={risk.status} size="sm" />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 4 }}>{risk.description}</div>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Mitigation: {risk.mitigation}</div>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>Owner: <strong>{risk.owner}</strong></div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* F. Blockers */}
          <div className="detail-section">
            <div className="detail-section-header" style={{ color: COLORS.criticalRed, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={18} color={COLORS.criticalRed} />
                Blockers & Bottlenecks
                {openBlockers > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, background: COLORS.criticalRed, color: 'white', padding: '1px 7px', borderRadius: 99 }}>{openBlockers} open</span>
                )}
              </div>
              <button className="btn btn-sm" style={{ background: COLORS.criticalRed, color: COLORS.white, border: 'none' }} onClick={() => setShowBlockerForm(true)}>
                <Plus size={13} /> Raise Blocker
              </button>
            </div>
            <div className="detail-section-body">
              {projectBlockers.length === 0 ? (
                <div style={{ textAlign: 'center', color: COLORS.textSecondary, padding: '20px 0' }}>
                  <CheckCircle size={28} color={COLORS.successGreen} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 13 }}>No blockers raised on this project</div>
                </div>
              ) : (
                projectBlockers.map((b) => (
                  <BlockerCard
                    key={b.id}
                    blocker={b}
                    onUpdate={(id, status) => updateBlocker(id, { status })}
                    onView={setViewBlocker}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Project Overview Stats */}
          <div className="detail-section">
            <div className="detail-section-header" style={{ color: COLORS.primaryBlue }}>
              <BarChart2 size={18} color={COLORS.primaryBlue} />
              Project Overview
            </div>
            <div className="detail-section-body" style={{ padding: '16px 20px' }}>
              {[
                { label: 'Business Unit', value: project.businessUnit },
                { label: 'Business Owner', value: project.businessOwner },
                { label: 'Risk Level', value: <StatusBadge value={project.riskLevel} type="risk" size="sm" /> },
                { label: 'Planned Start', value: project.plannedStartDate },
                { label: 'Go-Live Target', value: project.goLiveDate },
                ...(project.actualCompletionDate ? [{ label: 'Actual Completion', value: project.actualCompletionDate }] : []),
              ].map((item) => (
                <div key={item.label} className="stat-row">
                  <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="detail-section">
            <div className="detail-section-header" style={{ color: COLORS.successGreen }}>
              <Users size={18} color={COLORS.successGreen} />
              Team Information
            </div>
            <div className="detail-section-body" style={{ padding: '8px 20px 16px' }}>
              <TeamSection project={project} onUpdate={(updates) => updateProject(project.id, updates)} />
            </div>
          </div>

          {/* Comments */}
          {project.comments && (
            <div className="detail-section">
              <div className="detail-section-header" style={{ color: COLORS.textSecondary }}>
                <FileText size={18} color={COLORS.textSecondary} />
                Comments & Notes
              </div>
              <div className="detail-section-body">
                <p style={{ fontSize: 13, color: COLORS.textPrimary, lineHeight: 1.6 }}>{project.comments}</p>
              </div>
            </div>
          )}

          {/* Blocker Summary */}
          <div className="detail-section">
            <div className="detail-section-header">
              <Clock size={18} color={COLORS.textSecondary} />
              Blocker Summary
            </div>
            <div className="detail-section-body" style={{ padding: '12px 20px' }}>
              {['Open', 'In Progress', 'Escalated', 'Resolved', 'Closed'].map((status) => {
                const count = projectBlockers.filter((b) => b.status === status).length
                return (
                  <div key={status} className="stat-row">
                    <StatusBadge value={status} type="blockerStatus" size="sm" />
                    <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Project */}
      {showEdit && (
        <ProjectForm
          initial={project}
          onSave={(data) => updateProject(project.id, data)}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* Raise Blocker */}
      {showBlockerForm && (
        <BlockerForm
          defaultProjectId={project.id}
          onSave={(data) => addBlocker(data)}
          onClose={() => setShowBlockerForm(false)}
        />
      )}

      {/* View Blocker Detail */}
      {viewBlocker && (
        <div className="modal-overlay" onClick={() => setViewBlocker(undefined)}>
          <div className="modal-box" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 }}>{viewBlocker.blockerType} Blocker</div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary, maxWidth: 440 }}>{viewBlocker.description}</h2>
              </div>
              <button onClick={() => setViewBlocker(undefined)} style={{ padding: 6, borderRadius: 8, border: '1.5px solid #EFEFF1', background: 'transparent', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <StatusBadge value={viewBlocker.severity} type="severity" />
                <StatusBadge value={viewBlocker.status} type="blockerStatus" />
              </div>
              {[
                { label: 'Project', value: viewBlocker.projectName },
                { label: 'Raised By', value: viewBlocker.raisedBy },
                { label: 'Raised Date', value: viewBlocker.raisedDate },
                { label: 'Assigned Owner', value: viewBlocker.assignedOwner },
                { label: 'ETA', value: viewBlocker.eta },
              ].map((item) => (
                <div key={item.label} className="stat-row">
                  <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{item.value}</span>
                </div>
              ))}
              {viewBlocker.resolutionNotes && (
                <div style={{ marginTop: 14, padding: '12px 14px', background: '#F2F3F3', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 4 }}>Resolution Notes</div>
                  <div style={{ fontSize: 13, color: COLORS.textPrimary, lineHeight: 1.5 }}>{viewBlocker.resolutionNotes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
