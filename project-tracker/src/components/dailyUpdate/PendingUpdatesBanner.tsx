import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useTeam } from '../../context/TeamContext'
import { useReminderClock } from '../../hooks/useReminderClock'
import { hasSubmittedToday, isPastReminderTime } from '../../utils/reminderEngine'
import { isDeveloper } from '../../utils/permissions'
import { COLORS } from '../../constants/theme'

export default function PendingUpdatesBanner() {
  const { currentUser, dailyUpdates } = useTeam()
  const now = useReminderClock()

  if (!isDeveloper(currentUser)) return null
  if (!isPastReminderTime(now)) return null
  if (hasSubmittedToday(currentUser.id, dailyUpdates, now)) return null

  return (
    <div style={{ background: '#F3E6DD', borderBottom: `1px solid ${COLORS.warningOrange}`, padding: '10px 28px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: COLORS.textPrimary }}>
      <AlertCircle size={16} color={COLORS.warningOrange} />
      You haven't submitted today's daily update yet.
      <Link to="/my-updates" className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }}>Fill it in</Link>
    </div>
  )
}
