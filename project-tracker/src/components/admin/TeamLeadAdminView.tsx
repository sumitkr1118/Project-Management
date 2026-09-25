import { useState } from 'react'
import { UserPlus, Pencil } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTeam } from '../../context/TeamContext'
import { getReportees } from '../../utils/permissions'
import ProjectForm from '../project/ProjectForm'
import UserForm from './UserForm'
import UserTable from './UserTable'
import StatusBadge from '../shared/StatusBadge'
import PendingUpdatesPanel from '../dailyUpdate/PendingUpdatesPanel'
import type { Project } from '../../types'

export default function TeamLeadAdminView() {
  const { projects, updateProject } = useApp()
  const { users, currentUser, addUser } = useTeam()
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined)

  const myReportees = getReportees(currentUser, users)
  const myProjects = projects.filter((p) => p.teamLeadId === currentUser.id)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="page-title">Administration</div>
        <button className="btn btn-primary" onClick={() => setShowUserForm(true)}>
          <UserPlus size={15} /> Onboard Developer
        </button>
      </div>

      <div className="detail-section mb-6">
        <div className="detail-section-header">My Team</div>
        <div className="detail-section-body">
          <UserTable users={myReportees} />
        </div>
      </div>

      <div className="detail-section mb-6">
        <div className="detail-section-header">My Projects</div>
        <div className="detail-section-body">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>Project</th><th>Status</th><th>Health</th><th>Completion</th><th></th></tr>
              </thead>
              <tbody>
                {myProjects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td><StatusBadge value={p.status} type="status" /></td>
                    <td><StatusBadge value={p.healthIndicator} type="health" /></td>
                    <td>{p.completionPercentage}%</td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingProject(p)}>
                        <Pencil size={13} /> Update
                      </button>
                    </td>
                  </tr>
                ))}
                {myProjects.length === 0 && (
                  <tr><td colSpan={5} className="text-muted text-sm">No projects assigned to you yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PendingUpdatesPanel reportees={myReportees} />

      {showUserForm && (
        <UserForm role="Developer" reportsToId={currentUser.id} onSave={addUser} onClose={() => setShowUserForm(false)} />
      )}
      {editingProject && (
        <ProjectForm
          initial={editingProject}
          onSave={(data) => updateProject(editingProject.id, data)}
          onClose={() => setEditingProject(undefined)}
        />
      )}
    </div>
  )
}
