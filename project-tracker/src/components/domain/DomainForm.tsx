import { useState } from 'react'
import type { Domain } from '../../types'
import { DOMAIN_PALETTE, COLORS } from '../../constants/theme'
import Modal from '../shared/Modal'

interface DomainFormProps {
  initial?: Domain
  onSave: (data: Omit<Domain, 'id' | 'createdAt' | 'updatedAt' | 'projectCount'>) => void
  onClose: () => void
}

export default function DomainForm({ initial, onSave, onClose }: DomainFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    owner: initial?.owner ?? '',
    ownerEmail: initial?.ownerEmail ?? '',
    isActive: initial?.isActive ?? true,
    color: initial?.color ?? DOMAIN_PALETTE[0],
  })

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = () => {
    if (!form.name.trim() || !form.owner.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <Modal
      title={initial ? 'Edit Domain' : 'Add New Domain'}
      onClose={onClose}
      maxWidth={560}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{initial ? 'Save Changes' : 'Create Domain'}</button>
        </>
      }
    >
      <div>
        <div className="form-group">
          <label className="form-label">Domain Name *</label>
          <input className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. HR, Finance, RPA..." />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Brief description of this domain's scope..." />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Domain Owner *</label>
            <input className="form-input" value={form.owner} onChange={(e) => set('owner', e.target.value)} placeholder="Full name" />
          </div>
          <div className="form-group">
            <label className="form-label">Owner Email</label>
            <input className="form-input" type="email" value={form.ownerEmail} onChange={(e) => set('ownerEmail', e.target.value)} placeholder="owner@company.com" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Domain Color</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {DOMAIN_PALETTE.map((color) => (
              <button
                key={color}
                onClick={() => set('color', color)}
                style={{ width: 32, height: 32, borderRadius: 8, background: color, border: form.color === color ? `3px solid ${COLORS.textPrimary}` : '3px solid transparent', cursor: 'pointer', transition: 'all 0.15s', transform: form.color === color ? 'scale(1.15)' : 'scale(1)' }}
              />
            ))}
          </div>
        </div>

        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <label className="form-label" style={{ margin: 0 }}>Active Status</label>
          <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: COLORS.successGreen }} />
          <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{form.isActive ? 'Active — visible across the platform' : 'Inactive — hidden from project views'}</span>
        </div>
      </div>
    </Modal>
  )
}
