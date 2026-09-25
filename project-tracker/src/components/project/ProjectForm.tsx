import { useState } from 'react'
import type { Project, ProjectStatus, Priority, RiskLevel, BudgetStatus, HealthIndicator, DeliveryMethodology } from '../../types'
import Modal from '../shared/Modal'
import { useApp } from '../../context/AppContext'

interface ProjectFormProps {
  initial?: Project
  onSave: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  onClose: () => void
}

const DEFAULT: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
  projectId: '', name: '', description: '', domainId: '', domainName: '', subDomain: '', businessUnit: '',
  businessOwner: '', projectManager: '', developer: '', qaOwner: '', supportOwner: '',
  plannedStartDate: '', devStartDate: '', sitStartDate: '', uatStartDate: '', goLiveDate: '',
  status: 'On Track', priority: 'Medium', riskLevel: 'Low',
  deliveryMethodology: 'Agile', slaTarget: 90, completionPercentage: 0,
  budgetStatus: 'On Budget', healthIndicator: 'Healthy', comments: '',
  delayCount: 0, escalationStatus: false, slaCompliance: true, governanceRemarks: '',
}

export default function ProjectForm({ initial, onSave, onClose }: ProjectFormProps) {
  const { domains } = useApp()
  const [form, setForm] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>(initial ?? DEFAULT)

  const set = (key: string, value: string | number | boolean) => setForm((f) => ({ ...f, [key]: value }))

  const handleDomainChange = (domainId: string) => {
    const domain = domains.find((d) => d.id === domainId)
    setForm((f) => ({ ...f, domainId, domainName: domain?.name ?? '' }))
  }

  const handleSubmit = () => {
    if (!form.projectId.trim() || !form.name.trim() || !form.domainId || !form.goLiveDate) return
    onSave(form)
    onClose()
  }

  return (
    <Modal
      title={initial ? 'Edit Project' : 'Onboard New Project'}
      onClose={onClose}
      maxWidth={800}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{initial ? 'Save Changes' : 'Onboard Project'}</button>
        </>
      }
    >
      <div>
        {/* Basic Information */}
        <div className="form-section-title">Basic Information</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Project ID *</label>
            <input className="form-input" value={form.projectId} onChange={(e) => set('projectId', e.target.value)} placeholder="e.g. HR-001" />
          </div>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Project name" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Brief project overview..." />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Domain *</label>
            <select className="form-input" value={form.domainId} onChange={(e) => handleDomainChange(e.target.value)}>
              <option value="">Select domain...</option>
              {domains.filter((d) => d.isActive).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sub-Domain</label>
            <input className="form-input" value={form.subDomain} onChange={(e) => set('subDomain', e.target.value)} placeholder="e.g. Employee Experience" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Business Unit</label>
          <input className="form-input" value={form.businessUnit} onChange={(e) => set('businessUnit', e.target.value)} placeholder="e.g. Human Resources" />
        </div>

        {/* Ownership */}
        <div className="form-section-title">Ownership</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Business Owner</label>
            <input className="form-input" value={form.businessOwner} onChange={(e) => set('businessOwner', e.target.value)} placeholder="Business owner name" />
          </div>
          <div className="form-group">
            <label className="form-label">Project Manager</label>
            <input className="form-input" value={form.projectManager} onChange={(e) => set('projectManager', e.target.value)} placeholder="PM name" />
          </div>
          <div className="form-group">
            <label className="form-label">Developer</label>
            <input className="form-input" value={form.developer} onChange={(e) => set('developer', e.target.value)} placeholder="Lead developer" />
          </div>
          <div className="form-group">
            <label className="form-label">QA Owner</label>
            <input className="form-input" value={form.qaOwner} onChange={(e) => set('qaOwner', e.target.value)} placeholder="QA owner" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Support Owner</label>
          <input className="form-input" value={form.supportOwner} onChange={(e) => set('supportOwner', e.target.value)} placeholder="Support team/owner" />
        </div>

        {/* Timeline */}
        <div className="form-section-title">Timeline Tracking</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Planned Start Date</label>
            <input className="form-input" type="date" value={form.plannedStartDate} onChange={(e) => set('plannedStartDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Dev Start Date</label>
            <input className="form-input" type="date" value={form.devStartDate} onChange={(e) => set('devStartDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">SIT Start Date</label>
            <input className="form-input" type="date" value={form.sitStartDate} onChange={(e) => set('sitStartDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">UAT Start Date</label>
            <input className="form-input" type="date" value={form.uatStartDate} onChange={(e) => set('uatStartDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Go-Live Date *</label>
            <input className="form-input" type="date" value={form.goLiveDate} onChange={(e) => set('goLiveDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Actual Completion</label>
            <input className="form-input" type="date" value={form.actualCompletionDate ?? ''} onChange={(e) => set('actualCompletionDate', e.target.value)} />
          </div>
        </div>

        {/* Governance */}
        <div className="form-section-title">Project Governance</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={(e) => set('status', e.target.value as ProjectStatus)}>
              {(['On Track', 'Delayed', 'Breached'] as ProjectStatus[]).map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-input" value={form.priority} onChange={(e) => set('priority', e.target.value as Priority)}>
              {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Risk Level</label>
            <select className="form-input" value={form.riskLevel} onChange={(e) => set('riskLevel', e.target.value as RiskLevel)}>
              {(['Low', 'Medium', 'High'] as RiskLevel[]).map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Delivery Methodology</label>
            <select className="form-input" value={form.deliveryMethodology} onChange={(e) => set('deliveryMethodology', e.target.value as DeliveryMethodology)}>
              {(['Agile', 'Waterfall', 'Hybrid', 'SAFe', 'Scrum', 'Kanban'] as DeliveryMethodology[]).map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">SLA Target (%)</label>
            <input className="form-input" type="number" min={0} max={100} value={form.slaTarget} onChange={(e) => set('slaTarget', Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Completion %</label>
            <input className="form-input" type="number" min={0} max={100} value={form.completionPercentage} onChange={(e) => set('completionPercentage', Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Budget Status</label>
            <select className="form-input" value={form.budgetStatus} onChange={(e) => set('budgetStatus', e.target.value as BudgetStatus)}>
              {(['On Budget', 'Over Budget', 'Under Budget'] as BudgetStatus[]).map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Health Indicator</label>
            <select className="form-input" value={form.healthIndicator} onChange={(e) => set('healthIndicator', e.target.value as HealthIndicator)}>
              {(['Healthy', 'At Risk', 'Critical'] as HealthIndicator[]).map((h) => <option key={h}>{h}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Governance Remarks</label>
          <textarea className="form-input" value={form.governanceRemarks} onChange={(e) => set('governanceRemarks', e.target.value)} placeholder="Governance notes, steering committee remarks..." />
        </div>
        <div className="form-group">
          <label className="form-label">Comments & Notes</label>
          <textarea className="form-input" value={form.comments} onChange={(e) => set('comments', e.target.value)} placeholder="Additional notes, status update..." />
        </div>
      </div>
    </Modal>
  )
}
