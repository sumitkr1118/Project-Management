import { useState } from 'react'
import { FolderOpen, Settings, ClipboardList, Users, FolderPlus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTeam } from '../../context/TeamContext'
import ProjectForm from '../project/ProjectForm'
import DomainManagement from '../../pages/DomainManagement'
import GovernanceLogs from '../../pages/GovernanceLogs'
import AdminTabs from './AdminTabs'
import UserAccessPanel from './UserAccessPanel'
import ProjectAssignmentTable from './ProjectAssignmentTable'
import SystemSettingsPanel from './SystemSettingsPanel'

const TABS = [
  { id: 'master', label: 'Master Data', icon: FolderOpen },
  { id: 'settings', label: 'System Settings', icon: Settings },
  { id: 'audit', label: 'Audit Logs', icon: ClipboardList },
  { id: 'users', label: 'User Access', icon: Users },
]

export default function ManagerAdminView() {
  const { projects, addProject } = useApp()
  const { currentUser, users } = useTeam()
  const [activeTab, setActiveTab] = useState('users')
  const [showProjectForm, setShowProjectForm] = useState(false)

  return (
    <div>
      <div className="mb-2">
        <h1 className="page-title">Administration Center</h1>
        <p className="text-sm text-muted mt-2">Manage master data, system settings, user access, and audit trails</p>
      </div>

      <AdminTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'master' && (
        <div>
          <div className="flex justify-end mb-4">
            <button className="btn btn-primary" onClick={() => setShowProjectForm(true)}>
              <FolderPlus size={15} /> Onboard Project
            </button>
          </div>
          <div className="detail-section mb-6">
            <div className="detail-section-header">Project → Team Lead Assignment</div>
            <div className="detail-section-body">
              <ProjectAssignmentTable projects={projects} />
            </div>
          </div>
          <div style={{ border: `1px solid #EFEFF1`, borderRadius: 12 }}>
            <DomainManagement />
          </div>
        </div>
      )}

      {activeTab === 'settings' && <SystemSettingsPanel />}

      {activeTab === 'audit' && <GovernanceLogs />}

      {activeTab === 'users' && (
        <UserAccessPanel users={users} newUserRole="Team Lead" newUserReportsTo={currentUser.id} addButtonLabel="Add Team Lead" />
      )}

      {showProjectForm && (
        <ProjectForm onSave={addProject} onClose={() => setShowProjectForm(false)} />
      )}
    </div>
  )
}
