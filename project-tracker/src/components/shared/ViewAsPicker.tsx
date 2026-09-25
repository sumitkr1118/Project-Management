import { useTeam } from '../../context/TeamContext'

export default function ViewAsPicker() {
  const { users, viewAsUserId, setViewAsUserId, currentUser } = useTeam()

  return (
    <select
      value={viewAsUserId ?? currentUser.id}
      onChange={(e) => setViewAsUserId(e.target.value)}
      title="Dev-only: Power Platform identity not resolved, pick a user to view as"
      style={{ padding: '6px 10px', border: '1.5px solid #FFC600', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#FFF4CC', color: '#4F4F4F', cursor: 'pointer', outline: 'none' }}
    >
      {users.map((u) => (
        <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
      ))}
    </select>
  )
}
