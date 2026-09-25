import { CheckCircle, Clock, AlertCircle, Edit2, X, Save } from 'lucide-react'
import { useState } from 'react'
import type { Project, ProjectStatus } from '../../types'
import { COLORS, STATUS_COLORS, STATUS_BG } from '../../constants/theme'

function getStatus(planned: string, actual?: string): 'completed' | 'delayed' | 'pending' {
  if (actual) return 'completed'
  if (new Date(planned) < new Date()) return 'delayed'
  return 'pending'
}

function MilestoneRow({ label, planned, actual, isLast }: { label: string; planned: string; actual?: string; isLast?: boolean }) {
  const status = getStatus(planned, actual)
  const cfg = {
    completed: { color: COLORS.successGreen, bg: '#D9EAE7', Icon: CheckCircle, label: 'Completed' },
    delayed: { color: COLORS.warningOrange, bg: '#F3E6DD', Icon: AlertCircle, label: 'Overdue' },
    pending: { color: COLORS.primaryBlue, bg: '#DAEBF6', Icon: Clock, label: 'Upcoming' },
  }[status]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr 120px', gap: 16, alignItems: 'center', padding: '14px 0', borderBottom: isLast ? 'none' : '1px solid #EFEFF1' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <cfg.Icon size={16} color={cfg.color} />
        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{label}</span>
      </div>
      <div>
        <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 }}>Planned</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>{planned || '—'}</div>
      </div>
      <div>
        <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 }}>Actual</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: actual ? COLORS.successGreen : COLORS.textSecondary }}>{actual || '—'}</div>
      </div>
      <div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color }}>
          {cfg.label}
        </span>
      </div>
    </div>
  )
}

interface EditDraft {
  status: ProjectStatus
  plannedStartDate: string
  devStartDate: string
  sitStartDate: string
  uatStartDate: string
  goLiveDate: string
  actualCompletionDate: string
}

const MILESTONE_FIELDS: Array<{ label: string; plannedKey: keyof EditDraft; actualKey: keyof EditDraft }> = [
  { label: 'Project Start', plannedKey: 'plannedStartDate', actualKey: 'devStartDate' },
  { label: 'Development Start', plannedKey: 'devStartDate', actualKey: 'devStartDate' },
  { label: 'SIT Start', plannedKey: 'sitStartDate', actualKey: 'sitStartDate' },
  { label: 'UAT Start', plannedKey: 'uatStartDate', actualKey: 'uatStartDate' },
  { label: 'Go-Live', plannedKey: 'goLiveDate', actualKey: 'actualCompletionDate' },
]

export default function ProjectTimeline({ project, onUpdate }: { project: Project; onUpdate?: (updates: Partial<Project>) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<EditDraft>({
    status: project.status,
    plannedStartDate: project.plannedStartDate,
    devStartDate: project.devStartDate,
    sitStartDate: project.sitStartDate,
    uatStartDate: project.uatStartDate,
    goLiveDate: project.goLiveDate,
    actualCompletionDate: project.actualCompletionDate ?? '',
  })

  const today = new Date()

  const milestones = [
    { label: 'Project Start', planned: project.plannedStartDate, actual: project.devStartDate && new Date(project.devStartDate) <= today ? project.devStartDate : undefined },
    { label: 'Development Start', planned: project.devStartDate, actual: new Date(project.devStartDate) < today ? project.devStartDate : undefined },
    { label: 'SIT Start', planned: project.sitStartDate, actual: new Date(project.sitStartDate) < today && project.completionPercentage >= 40 ? project.sitStartDate : undefined },
    { label: 'UAT Start', planned: project.uatStartDate, actual: new Date(project.uatStartDate) < today && project.completionPercentage >= 70 ? project.uatStartDate : undefined },
    { label: 'Go-Live', planned: project.goLiveDate, actual: project.actualCompletionDate },
  ]

  const handleSave = () => {
    onUpdate?.({
      ...draft,
      actualCompletionDate: draft.actualCompletionDate || undefined,
    })
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft({
      status: project.status,
      plannedStartDate: project.plannedStartDate,
      devStartDate: project.devStartDate,
      sitStartDate: project.sitStartDate,
      uatStartDate: project.uatStartDate,
      goLiveDate: project.goLiveDate,
      actualCompletionDate: project.actualCompletionDate ?? '',
    })
    setEditing(false)
  }

  const inputStyle = {
    padding: '6px 10px', border: '1.5px solid #D7D7DF', borderRadius: 6,
    fontSize: 13, color: COLORS.textPrimary, outline: 'none', width: '100%',
  }

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr 120px', gap: 16, flex: 1, padding: '8px 0 10px', borderBottom: '2px solid #EFEFF1' }}>
          {['Milestone', 'Planned Date', 'Actual Date', 'Status'].map((h) => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.textSecondary }}>{h}</div>
          ))}
        </div>
        {onUpdate && !editing && (
          <button
            onClick={() => setEditing(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, border: `1.5px solid ${COLORS.primaryBlue}`, background: 'transparent', color: COLORS.primaryBlue, fontSize: 12, fontWeight: 700, cursor: 'pointer', marginLeft: 12, marginBottom: 10, flexShrink: 0 }}
          >
            <Edit2 size={12} /> Edit
          </button>
        )}
      </div>

      {editing ? (
        <div>
          {/* Project Status */}
          <div style={{ padding: '12px 16px', background: STATUS_BG[draft.status] ?? '#F2F3F3', borderRadius: 8, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, minWidth: 100 }}>Project Status</span>
            <select
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as ProjectStatus }))}
              style={{ border: `1.5px solid ${STATUS_COLORS[draft.status] ?? COLORS.primaryBlue}`, background: 'white', color: STATUS_COLORS[draft.status] ?? COLORS.primaryBlue, padding: '6px 12px', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer', outline: 'none' }}
            >
              <option value="On Track">On Track</option>
              <option value="Delayed">Delayed</option>
              <option value="Breached">Breached</option>
            </select>
          </div>

          {MILESTONE_FIELDS.map((m, i) => (
            <div key={m.label} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr 120px', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: i === MILESTONE_FIELDS.length - 1 ? 'none' : '1px solid #EFEFF1' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{m.label}</span>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 }}>Planned</div>
                <input
                  type="date"
                  style={inputStyle}
                  value={draft[m.plannedKey]}
                  onChange={(e) => setDraft((d) => ({ ...d, [m.plannedKey]: e.target.value }))}
                />
              </div>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 }}>Actual</div>
                <input
                  type="date"
                  style={inputStyle}
                  value={draft[m.actualKey]}
                  onChange={(e) => setDraft((d) => ({ ...d, [m.actualKey]: e.target.value }))}
                />
              </div>
              <div style={{ fontSize: 11, color: COLORS.textSecondary }}>—</div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 16px', borderRadius: 7, border: 'none', background: COLORS.primaryBlue, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              <Save size={13} /> Save Changes
            </button>
            <button onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 7, border: '1.5px solid #D7D7DF', background: 'transparent', color: COLORS.textSecondary, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        milestones.map((m, i) => (
          <MilestoneRow key={m.label} {...m} isLast={i === milestones.length - 1} />
        ))
      )}

      {!editing && project.delayCount > 0 && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: '#F3E6DD', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={15} color={COLORS.warningOrange} />
          <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.warningOrange }}>
            {project.delayCount} delay{project.delayCount > 1 ? 's' : ''} recorded on this project
          </span>
        </div>
      )}
    </div>
  )
}
