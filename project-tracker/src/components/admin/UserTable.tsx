import type { User } from '../../types'
import { useTeam } from '../../context/TeamContext'
import StatusBadge from '../shared/StatusBadge'

interface UserTableProps {
  users: User[]
}

export default function UserTable({ users }: UserTableProps) {
  const { users: allUsers, updateUser } = useTeam()
  const nameOf = (id?: string) => allUsers.find((u) => u.id === id)?.name ?? '—'

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Reports To</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td className="text-muted">{u.email}</td>
              <td><StatusBadge value={u.role} type="role" /></td>
              <td className="text-muted">{nameOf(u.reportsToId)}</td>
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
