import { useState } from 'react'
import type { User, UserRole } from '../../types'
import Modal from '../shared/Modal'

interface UserFormProps {
  role: UserRole
  reportsToId?: string
  onSave: (data: Omit<User, 'id'>) => void
  onClose: () => void
}

export default function UserForm({ role, reportsToId, onSave, onClose }: UserFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [domain, setDomain] = useState('')

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return
    onSave({ name: name.trim(), email: email.trim(), role, reportsToId, domain: domain.trim() || undefined, isActive: true })
    onClose()
  }

  return (
    <Modal
      title={role === 'Team Lead' ? 'Onboard Team Lead' : 'Onboard Developer'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Onboard</button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Nair" />
      </div>
      <div className="form-group">
        <label className="form-label">Email *</label>
        <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
      </div>
      <div className="form-group">
        <label className="form-label">Domain</label>
        <input className="form-input" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. Finance" />
      </div>
    </Modal>
  )
}
