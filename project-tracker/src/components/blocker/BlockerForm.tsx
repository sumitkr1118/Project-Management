import { useState } from 'react'
import type { Blocker, BlockerType, BlockerSeverity, BlockerStatus } from '../../types'
import Modal from '../shared/Modal'
import { useApp } from '../../context/AppContext'
import { useTeam } from '../../context/TeamContext'

interface BlockerFormProps {
  initial?: Blocker
  defaultProjectId?: string
  onSave: (data: Omit<Blocker, 'id' | 'createdAt' | 'updatedAt'>) => void
  onClose: () => void
}

const BLOCKER_TYPES: BlockerType[] = ['Technical', 'Resource', 'Approval', 'Dependency', 'Environment', 'Requirement']
const SEVERITIES: BlockerSeverity[] = ['Low', 'Medium', 'High', 'Critical']
const STATUSES: BlockerStatus[] = ['Open', 'In Progress', 'Resolved', 'Escalated', 'Closed']

export default function BlockerForm({ initial, defaultProjectId, onSave, onClose }: BlockerFormProps) {
  const { projects } = useApp()
  const { currentUser } = useTeam()

  const defaultProject = projects.find((p) => p.id === (initial?.projectId ?? defaultProjectId))

  const [form, setForm] = useState({
    projectId: initial?.projectId ?? defaultProjectId ?? '',
    projectName: initial?.projectName ?? defaultProject?.name ?? '',
    blockerType: initial?.blockerType ?? 'Technical' as BlockerType,
    severity: initial?.severity ?? 'High' as BlockerSeverity,
    description: initial?.description ?? '',
    raisedBy: initial?.raisedBy ?? currentUser.name,
    raisedDate: initial?.raisedDate ?? new Date().toISOString().split('T')[0],
    assignedOwner: initial?.assignedOwner ?? '',
    eta: initial?.eta ?? '',
    resolutionNotes: initial?.resolutionNotes ?? '',
    status: initial?.status ?? 'Open' as BlockerStatus,
  })

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    setForm((f) => ({ ...f, projectId, projectName: project?.name ?? '' }))
  }

  const handleSubmit = () => {
    if (!form.projectId || !form.description.trim() || !form.assignedOwner.trim() || !form.eta) return
    onSave(form)
    onClose()
  }

  return (
    <Modal
      title={initial ? 'Update Blocker' : 'Raise New Blocker'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{initial ? 'Update' : 'Raise Blocker'}</button>
        </>
      }
    >
      <div>
        <div className="form-group">
          <label className="form-label">Project *</label>
          <select className="form-input" value={form.projectId} onChange={(e) => handleProjectChange(e.target.value)}>
            <option value="">Select project...</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.projectId} — {p.name}</option>)}
          </select>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Blocker Type *</label>
            <select className="form-input" value={form.blockerType} onChange={(e) => set('blockerType', e.target.value)}>
              {BLOCKER_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Severity *</label>
            <select className="form-input" value={form.severity} onChange={(e) => set('severity', e.target.value)}>
              {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea className="form-input" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the blocker in detail — include impact and current state..." style={{ minHeight: 100 }} />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Raised By</label>
            <input className="form-input" value={form.raisedBy} onChange={(e) => set('raisedBy', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Raised Date</label>
            <input className="form-input" type="date" value={form.raisedDate} onChange={(e) => set('raisedDate', e.target.value)} />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Assigned Owner *</label>
            <input className="form-input" value={form.assignedOwner} onChange={(e) => set('assignedOwner', e.target.value)} placeholder="Person responsible for resolution" />
          </div>
          <div className="form-group">
            <label className="form-label">ETA for Resolution *</label>
            <input className="form-input" type="date" value={form.eta} onChange={(e) => set('eta', e.target.value)} />
          </div>
        </div>

        {initial && (
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={(e) => set('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Resolution Notes</label>
          <textarea className="form-input" value={form.resolutionNotes} onChange={(e) => set('resolutionNotes', e.target.value)} placeholder="Actions taken, workarounds, resolution progress..." />
        </div>
      </div>
    </Modal>
  )
}
