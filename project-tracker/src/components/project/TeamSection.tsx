import { Edit2, Save, X } from 'lucide-react'
import { useState } from 'react'
import type { Project } from '../../types'
import { COLORS } from '../../constants/theme'

const ROLE_COLORS = [COLORS.primaryBlue, COLORS.successGreen, COLORS.warningOrange, '#6C47CC', '#0469A8']

function TeamMember({ name, role, index }: { name: string; role: string; index: number }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const color = ROLE_COLORS[index % ROLE_COLORS.length]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #EFEFF1' }}>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{initials}</span>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>{name}</div>
        <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{role}</div>
      </div>
    </div>
  )
}

interface TeamDraft {
  businessOwner: string
  projectManager: string
  developer: string
  qaOwner: string
  supportOwner: string
}

const TEAM_FIELDS: Array<{ key: keyof TeamDraft; label: string }> = [
  { key: 'businessOwner', label: 'Business Owner' },
  { key: 'projectManager', label: 'Project Manager' },
  { key: 'developer', label: 'Lead Developer' },
  { key: 'qaOwner', label: 'QA Owner' },
  { key: 'supportOwner', label: 'Support Owner' },
]

export default function TeamSection({ project, onUpdate }: { project: Project; onUpdate?: (updates: Partial<Project>) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<TeamDraft>({
    businessOwner: project.businessOwner,
    projectManager: project.projectManager,
    developer: project.developer,
    qaOwner: project.qaOwner,
    supportOwner: project.supportOwner,
  })

  const team = [
    { name: project.businessOwner, role: 'Business Owner' },
    { name: project.projectManager, role: 'Project Manager' },
    { name: project.developer, role: 'Lead Developer' },
    { name: project.qaOwner, role: 'QA Owner' },
    { name: project.supportOwner, role: 'Support Owner' },
  ].filter((m) => m.name)

  const handleSave = () => {
    onUpdate?.(draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft({
      businessOwner: project.businessOwner,
      projectManager: project.projectManager,
      developer: project.developer,
      qaOwner: project.qaOwner,
      supportOwner: project.supportOwner,
    })
    setEditing(false)
  }

  const inputStyle = {
    padding: '7px 10px', border: '1.5px solid #D7D7DF', borderRadius: 6,
    fontSize: 13, color: COLORS.textPrimary, outline: 'none', width: '100%',
  }

  if (editing) {
    return (
      <div>
        {TEAM_FIELDS.map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textSecondary, marginBottom: 4 }}>{label}</div>
            <input
              style={inputStyle}
              value={draft[key]}
              onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
              placeholder={label}
            />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 16px', borderRadius: 7, border: 'none', background: COLORS.primaryBlue, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <Save size={13} /> Save
          </button>
          <button onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 7, border: '1.5px solid #D7D7DF', background: 'transparent', color: COLORS.textSecondary, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <X size={13} /> Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        {onUpdate && (
          <button
            onClick={() => setEditing(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: `1.5px solid ${COLORS.primaryBlue}`, background: 'transparent', color: COLORS.primaryBlue, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            <Edit2 size={12} /> Edit Team
          </button>
        )}
      </div>
      {team.map((member, i) => (
        <TeamMember key={i} name={member.name} role={member.role} index={i} />
      ))}
      {team.length === 0 && (
        <div style={{ textAlign: 'center', color: COLORS.textSecondary, padding: '20px 0', fontSize: 13 }}>
          No team members assigned yet.
        </div>
      )}
    </div>
  )
}
