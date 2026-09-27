import { useState } from 'react'
import { Pencil, FolderKanban, ClipboardList, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTeam } from '../../context/TeamContext'
import { getReportees } from '../../utils/permissions'
import ProjectForm from '../project/ProjectForm'
import GovernanceLogs from '../../pages/GovernanceLogs'
import AdminTabs from './AdminTabs'
import UserAccessPanel from './UserAccessPanel'
import StatusBadge from '../shared/StatusBadge'
import PendingUpdatesPanel from '../dailyUpdate/PendingUpdatesPanel'
import type { Project } from '../../types'

const TABS = [
  { id: 'projects', label: 'My Projects', icon: FolderKanban },
  { id: 'audit', label: 'Audit Logs', icon: ClipboardList },
  { id: 'users', label: 'User Access', icon: Users },
]

export default function TeamLeadAdminView() {
  const { projects, updateProject } = useApp()
  const { users, currentUser } = useTeam()
  const [activeTab, setActiveTab] = useState('users')
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined)

  const myReportees = getReportees(currentUser, users)
  const myProjects = projects.filter((p) => p.teamLeadId === currentUser.id)

  return (
    <div>
      <div className="mb-2">
        <h1 className="page-title">Administration Center</h1>
        <p className="text-sm text-muted mt-2">Manage your team, your projects, and review the audit trail</p>
      </div>

      <AdminTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'projects' && (
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
      )}

      {activeTab === 'audit' && <GovernanceLogs />}

      {activeTab === 'users' && (
        <div>
          <UserAccessPanel users={myReportees} newUserRole="Developer" newUserReportsTo={currentUser.id} addButtonLabel="Add Developer" />
          <div className="mt-6">
            <PendingUpdatesPanel reportees={myReportees} />
          </div>
        </div>
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
