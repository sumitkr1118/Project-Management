import type { LucideIcon } from 'lucide-react'
import { COLORS } from '../../constants/theme'

export interface AdminTab {
  id: string
  label: string
  icon: LucideIcon
}

interface AdminTabsProps {
  tabs: AdminTab[]
  active: string
  onChange: (id: string) => void
}

export default function AdminTabs({ tabs, active, onChange }: AdminTabsProps) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #EFEFF1', marginBottom: 24 }}>
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
              border: 'none', background: 'transparent', cursor: 'pointer', marginBottom: -1,
              borderBottom: isActive ? `2px solid ${COLORS.primaryBlue}` : '2px solid transparent',
              color: isActive ? COLORS.primaryBlue : COLORS.textSecondary,
              fontWeight: isActive ? 700 : 600, fontSize: 13,
            }}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
