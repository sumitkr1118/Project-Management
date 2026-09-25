import { useState } from 'react'
import type { TaskStatus, TaskUpdateEntry } from '../../types'
import { useTeam } from '../../context/TeamContext'
import { todayStr } from '../../utils/reminderEngine'

const TASK_STATUSES: TaskStatus[] = ['Not Started', 'In Progress', 'Blocked', 'Completed']

export default function TodayUpdateForm() {
  const { currentUser, getTasksForUser, getDailyUpdate, submitDailyUpdate } = useTeam()
  const today = todayStr()
  const myTasks = getTasksForUser(currentUser.id)
  const existing = getDailyUpdate(currentUser.id, today)

  const [entries, setEntries] = useState<Record<string, TaskUpdateEntry>>(() => {
    const map: Record<string, TaskUpdateEntry> = {}
    for (const t of myTasks) {
      const prior = existing?.entries.find((e) => e.taskId === t.id)
      map[t.id] = prior ?? { taskId: t.id, status: t.status, note: '' }
    }
    return map
  })
  const [overallNote, setOverallNote] = useState(existing?.overallNote ?? '')
  const [saved, setSaved] = useState(false)

  const setEntry = (taskId: string, updates: Partial<TaskUpdateEntry>) => {
    setEntries((prev) => ({ ...prev, [taskId]: { ...prev[taskId], ...updates } }))
    setSaved(false)
  }

  const handleSubmit = () => {
    submitDailyUpdate(currentUser.id, today, Object.values(entries), overallNote.trim() || undefined)
    setSaved(true)
  }

  if (myTasks.length === 0) {
    return <div className="empty-state">No tasks are currently assigned to you.</div>
  }

  return (
    <div className="detail-section">
      <div className="detail-section-header">
        Today's Update — {new Date().toLocaleDateString('en-AE', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="detail-section-body">
        {myTasks.map((t) => (
          <div key={t.id} className="form-group" style={{ borderBottom: '1px solid #EFEFF1', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{t.title}</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" value={entries[t.id].status} onChange={(e) => setEntry(t.id, { status: e.target.value as TaskStatus })}>
                  {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Note</label>
                <input className="form-input" value={entries[t.id].note} onChange={(e) => setEntry(t.id, { note: e.target.value })} placeholder="What did you do today?" />
              </div>
            </div>
          </div>
        ))}
        <div className="form-group">
          <label className="form-label">Overall Note (optional)</label>
          <textarea className="form-input" value={overallNote} onChange={(e) => { setOverallNote(e.target.value); setSaved(false) }} placeholder="Anything else worth flagging..." />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {existing ? 'Update Today\'s Submission' : 'Submit Today\'s Update'}
        </button>
        {saved && <span className="text-sm" style={{ color: '#007560', marginLeft: 12 }}>Saved.</span>}
      </div>
    </div>
  )
}
