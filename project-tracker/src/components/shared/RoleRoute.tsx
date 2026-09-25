import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { UserRole } from '../../types'
import { useTeam } from '../../context/TeamContext'

interface RoleRouteProps {
  allow: UserRole[]
  children: ReactNode
}

export default function RoleRoute({ allow, children }: RoleRouteProps) {
  const { currentUser } = useTeam()
  return allow.includes(currentUser.role) ? <>{children}</> : <Navigate to="/" replace />
}
