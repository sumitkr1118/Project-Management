import { useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import type { User, UserRole } from '../../types'
import { useTeam } from '../../context/TeamContext'
import UserForm from './UserForm'
import UserTable from './UserTable'

interface UserAccessPanelProps {
  users: User[]
  newUserRole: UserRole
  newUserReportsTo: string
  addButtonLabel: string
}

export default function UserAccessPanel({ users, newUserRole, newUserReportsTo, addButtonLabel }: UserAccessPanelProps) {
  const { addUser } = useTeam()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input className="search-input" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowForm(true)}>
          <UserPlus size={15} /> {addButtonLabel}
        </button>
      </div>

      <UserTable users={filtered} />

      {showForm && (
        <UserForm role={newUserRole} reportsToId={newUserReportsTo} onSave={addUser} onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}
