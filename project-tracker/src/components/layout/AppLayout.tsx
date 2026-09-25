import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import PendingUpdatesBanner from '../dailyUpdate/PendingUpdatesBanner'
import ChatbotWidget from '../chatbot/ChatbotWidget'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <PendingUpdatesBanner />
        <main className="page-content">
          {children}
        </main>
      </div>
      <ChatbotWidget />
    </div>
  )
}
