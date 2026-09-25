import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useChatbotConversation } from '../../hooks/useChatbotConversation'
import ChatbotMessageList from './ChatbotMessageList'
import ChatbotInput from './ChatbotInput'

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const { messages, sendMessage } = useChatbotConversation()

  return (
    <>
      <button className="chatbot-fab" onClick={() => setOpen((v) => !v)} aria-label="Open chatbot">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <div className={open ? 'chatbot-panel open' : 'chatbot-panel'}>
        <div className="chatbot-panel-header">
          <span>Portfolio Assistant</span>
          <button className="btn-icon" onClick={() => setOpen(false)} aria-label="Close chatbot">
            <X size={16} />
          </button>
        </div>
        <ChatbotMessageList messages={messages} />
        <ChatbotInput onSend={sendMessage} />
      </div>
    </>
  )
}
