import type { Project } from '../../types'
import { useApp } from '../../context/AppContext'
import { useTeam } from '../../context/TeamContext'
import { isTeamLead } from '../../utils/permissions'

export default function ProjectAssignmentTable({ projects }: { projects: Project[] }) {
  const { updateProject } = useApp()
  const { users } = useTeam()
  const teamLeads = users.filter(isTeamLead)

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Domain</th>
            <th>Team Lead</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td className="text-muted">{p.domainName}</td>
              <td>
                <select
                  className="form-input"
                  style={{ padding: '6px 10px', fontSize: 13 }}
                  value={p.teamLeadId ?? ''}
                  onChange={(e) => updateProject(p.id, { teamLeadId: e.target.value || undefined })}
                >
                  <option value="">Unassigned</option>
                  {teamLeads.map((tl) => <option key={tl.id} value={tl.id}>{tl.name}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
