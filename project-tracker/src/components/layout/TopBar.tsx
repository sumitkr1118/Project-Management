import { Bell, Search, ChevronDown, User } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { COLORS, ROLE_COLORS } from '../../constants/theme'
import { useApp } from '../../context/AppContext'
import { useTeam } from '../../context/TeamContext'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Executive Dashboard',
  '/domains': 'Domain Management',
  '/projects': 'All Projects',
  '/blockers': 'Blocker Management',
  '/governance': 'Governance Logs',
  '/admin': 'Administration',
  '/my-updates': 'My Daily Updates',
}

export default function TopBar() {
  const { blockers } = useApp()
  const { currentUser } = useTeam()
  const location = useLocation()
  const [showProfile, setShowProfile] = useState(false)

  const title = PAGE_TITLES[location.pathname] ?? 'Project Detail'
  const criticalBlockers = blockers.filter((b) => b.severity === 'Critical' && b.status !== 'Resolved' && b.status !== 'Closed').length

  return (
    <header className="topbar">
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.textPrimary, letterSpacing: '-0.2px' }}>{title}</h1>
        <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 1 }}>
          {new Date().toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#BDBDBD' }} />
          <input
            placeholder="Quick search..."
            style={{ padding: '8px 14px 8px 34px', border: '1.5px solid #EFEFF1', borderRadius: 8, fontSize: 13, width: 200, outline: 'none', background: '#F2F3F3', color: COLORS.textPrimary }}
          />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button className="btn-icon" style={{ padding: 8 }}>
            <Bell size={18} color={criticalBlockers > 0 ? COLORS.criticalRed : COLORS.textSecondary} />
          </button>
          {criticalBlockers > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, background: COLORS.criticalRed, borderRadius: '50%', fontSize: 10, fontWeight: 700, color: COLORS.white, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
              {criticalBlockers}
            </span>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfile((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, border: '1.5px solid #EFEFF1', background: '#F2F3F3', cursor: 'pointer' }}
          >
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: COLORS.primaryBlue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} color="white" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, lineHeight: 1.2 }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{currentUser.role}</div>
            </div>
            <ChevronDown size={13} color={COLORS.textSecondary} />
          </button>

          {showProfile && (
            <div style={{ position: 'absolute', right: 0, top: '110%', background: COLORS.white, border: '1px solid #EFEFF1', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: 12, minWidth: 220, zIndex: 100 }}>
              <div style={{ padding: '8px 12px', marginBottom: 8, borderBottom: '1px solid #EFEFF1' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.textPrimary }}>{currentUser.name}</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{currentUser.email}</div>
                <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: ROLE_COLORS[currentUser.role] ?? COLORS.primaryBlue, color: 'white' }}>
                  {currentUser.role}
                </span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span>Domain: {currentUser.domain}</span>
                <span>Environment: Power Apps</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
