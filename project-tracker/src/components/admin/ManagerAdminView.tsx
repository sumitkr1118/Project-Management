import { useState } from 'react'
import { UserPlus, FolderPlus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTeam } from '../../context/TeamContext'
import ProjectForm from '../project/ProjectForm'
import UserForm from './UserForm'
import UserTable from './UserTable'
import ProjectAssignmentTable from './ProjectAssignmentTable'

export default function ManagerAdminView() {
  const { projects, addProject } = useApp()
  const { users, addUser } = useTeam()
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="page-title">Administration</div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => setShowUserForm(true)}>
            <UserPlus size={15} /> Onboard Team Lead
          </button>
          <button className="btn btn-primary" onClick={() => setShowProjectForm(true)}>
            <FolderPlus size={15} /> Onboard Project
          </button>
        </div>
      </div>

      <div className="detail-section mb-6">
        <div className="detail-section-header">Team &amp; Roles</div>
        <div className="detail-section-body">
          <UserTable users={users} />
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-section-header">Project → Team Lead Assignment</div>
        <div className="detail-section-body">
          <ProjectAssignmentTable projects={projects} />
        </div>
      </div>

      {showProjectForm && (
        <ProjectForm onSave={addProject} onClose={() => setShowProjectForm(false)} />
      )}
      {showUserForm && (
        <UserForm role="Team Lead" onSave={addUser} onClose={() => setShowUserForm(false)} />
      )}
    </div>
  )
}
