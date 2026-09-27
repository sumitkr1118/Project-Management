import type { User } from '../../types'
import { useTeam } from '../../context/TeamContext'
import StatusBadge from '../shared/StatusBadge'

interface UserTableProps {
  users: User[]
}

export default function UserTable({ users }: UserTableProps) {
  const { updateUser } = useTeam()

  if (users.length === 0) {
    return <div className="empty-state text-sm">No users found</div>
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ fontWeight: 600 }}>{u.name}</td>
              <td className="text-muted">{u.email}</td>
              <td><StatusBadge value={u.role} type="role" /></td>
              <td>
                <span className={`tag ${u.isActive === false ? 'text-muted' : ''}`} style={{ background: u.isActive === false ? '#F2F3F3' : '#D9EAE7', color: u.isActive === false ? '#6F6F6F' : '#007560' }}>
                  {u.isActive === false ? 'Inactive' : 'Active'}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => updateUser(u.id, { isActive: u.isActive === false })}
                >
                  {u.isActive === false ? 'Reactivate' : 'Deactivate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
