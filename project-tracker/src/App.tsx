import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import DomainManagement from './pages/DomainManagement'
import DomainDetail from './pages/DomainDetail'
import ProjectList from './pages/ProjectList'
import ProjectDetail from './pages/ProjectDetail'
import BlockerManagement from './pages/BlockerManagement'
import GovernanceLogs from './pages/GovernanceLogs'
import Administration from './pages/Administration'
import MyDailyUpdates from './pages/MyDailyUpdates'
import RoleRoute from './components/shared/RoleRoute'

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<ExecutiveDashboard />} />
        <Route path="/domains" element={<DomainManagement />} />
        <Route path="/domains/:id" element={<DomainDetail />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/blockers" element={<BlockerManagement />} />
        <Route path="/governance" element={<GovernanceLogs />} />
        <Route path="/admin" element={<RoleRoute allow={['Manager', 'Team Lead']}><Administration /></RoleRoute>} />
        <Route path="/my-updates" element={<RoleRoute allow={['Developer']}><MyDailyUpdates /></RoleRoute>} />
      </Routes>
    </AppLayout>
  )
}
