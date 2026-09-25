import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { COLORS } from '../../constants/theme'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  maxWidth?: number
}

export default function Modal({ title, onClose, children, footer, maxWidth = 760 }: ModalProps) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box" style={{ maxWidth }}>
        <div className="modal-header">
          <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ padding: 6, borderRadius: 8, border: '1.5px solid #EFEFF1', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', color: COLORS.textSecondary }}
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
