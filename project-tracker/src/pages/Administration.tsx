import { Navigate } from 'react-router-dom'
import { useTeam } from '../context/TeamContext'
import { isManager, isTeamLead } from '../utils/permissions'
import ManagerAdminView from '../components/admin/ManagerAdminView'
import TeamLeadAdminView from '../components/admin/TeamLeadAdminView'

export default function Administration() {
  const { currentUser } = useTeam()

  if (isManager(currentUser)) return <ManagerAdminView />
  if (isTeamLead(currentUser)) return <TeamLeadAdminView />
  return <Navigate to="/" replace />
}
