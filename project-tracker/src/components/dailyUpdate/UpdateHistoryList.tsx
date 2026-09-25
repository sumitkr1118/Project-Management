import { useTeam } from '../../context/TeamContext'
import { todayStr } from '../../utils/reminderEngine'

export default function UpdateHistoryList() {
  const { currentUser, dailyUpdates, tasks } = useTeam()
  const today = todayStr()
  const taskTitle = (id: string) => tasks.find((t) => t.id === id)?.title ?? id

  const history = dailyUpdates
    .filter((d) => d.developerId === currentUser.id && d.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (history.length === 0) {
    return <div className="empty-state">No past submissions yet.</div>
  }

  return (
    <div className="detail-section">
      <div className="detail-section-header">Submission History</div>
      <div className="detail-section-body">
        {history.map((d) => (
          <div key={d.id} className="stat-row" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{d.date}</div>
            {d.entries.map((e) => (
              <div key={e.taskId} className="text-sm text-muted">
                [{e.status}] {taskTitle(e.taskId)}{e.note ? ` — ${e.note}` : ''}
              </div>
            ))}
            {d.overallNote && <div className="text-sm text-muted">Note: {d.overallNote}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
