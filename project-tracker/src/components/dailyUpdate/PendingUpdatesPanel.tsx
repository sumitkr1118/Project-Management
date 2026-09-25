import { Mail, MailWarning } from 'lucide-react'
import type { User } from '../../types'
import { useTeam } from '../../context/TeamContext'
import { useReminderClock } from '../../hooks/useReminderClock'
import { getMissingDevelopersToday, buildReminderMailto, sendReminderEmails } from '../../utils/reminderEngine'
import { COLORS } from '../../constants/theme'

interface PendingUpdatesPanelProps {
  reportees: User[]
}

export default function PendingUpdatesPanel({ reportees }: PendingUpdatesPanelProps) {
  const { dailyUpdates, tasks } = useTeam()
  const now = useReminderClock()
  const missing = getMissingDevelopersToday(reportees, dailyUpdates, now)

  if (reportees.length === 0) return null

  return (
    <div className="detail-section">
      <div className="detail-section-header">
        <MailWarning size={16} color={missing.length ? COLORS.warningOrange : COLORS.successGreen} />
        Pending Daily Updates ({missing.length}/{reportees.length})
      </div>
      <div className="detail-section-body">
        {missing.length === 0 ? (
          <div className="text-muted text-sm">Everyone has submitted today's update.</div>
        ) : (
          <>
            {missing.map((dev) => {
              const projectNames = [...new Set(tasks.filter((t) => t.assignedToId === dev.id).map((t) => t.projectId))]
              return (
                <div key={dev.id} className="stat-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{dev.name}</div>
                    <div className="text-xs text-muted">{dev.email}</div>
                  </div>
                  <a href={buildReminderMailto(dev, projectNames)} className="btn btn-secondary btn-sm">
                    <Mail size={13} /> Remind
                  </a>
                </div>
              )
            })}
            <button className="btn btn-primary btn-sm mt-4" onClick={() => sendReminderEmails(missing)}>
              <Mail size={13} /> Remind All Pending
            </button>
          </>
        )}
      </div>
    </div>
  )
}
