import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, FolderKanban,
  AlertTriangle, FileText, UsersRound, ShieldCheck, ClipboardList,
  type LucideIcon,
} from 'lucide-react'
import { COLORS, NAV_ITEMS } from '../../constants/theme'
import { useTeam } from '../../context/TeamContext'
import { filterNavItemsByRole } from '../../utils/permissions'

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Building2, FolderKanban, AlertTriangle, FileText, ShieldCheck, ClipboardList,
}

export default function Sidebar() {
  const { currentUser } = useTeam()
  const navItems = filterNavItemsByRole(NAV_ITEMS, currentUser.role)

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{ width: 40, height: 40, background: COLORS.primaryBlue, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,117,96,0.4)' }}>
            <UsersRound size={22} color={COLORS.white} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.white, letterSpacing: '-0.3px', lineHeight: 1.2 }}>Project</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.sidebarActiveText, letterSpacing: '-0.3px', lineHeight: 1.2 }}>Management</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(196,206,212,0.5)', letterSpacing: '1px', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>
          Navigation
        </div>
        {navItems.map(({ path, label, icon }) => {
          const Icon = ICONS[icon]
          return (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? COLORS.sidebarActiveText : COLORS.silverGray,
                background: isActive ? COLORS.sidebarActiveBg : 'transparent',
                borderLeft: isActive ? `3px solid ${COLORS.sidebarActiveText}` : '3px solid transparent',
                transition: 'all 0.15s ease',
                textDecoration: 'none',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} color={isActive ? COLORS.sidebarActiveText : COLORS.silverGray} />
                  {label}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: 12, color: 'rgba(196,206,212,0.5)', textAlign: 'center' }}>
        Project Management v1.0 • © 2025
      </div>
    </aside>
  )
}
