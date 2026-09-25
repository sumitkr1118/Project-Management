import { useEffect, useRef } from 'react'

export interface ChatMessage {
  id: string
  role: 'bot' | 'user'
  text: string
}

export default function ChatbotMessageList({ messages }: { messages: ChatMessage[] }) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  return (
    <div className="chatbot-messages">
      {messages.map((m) => (
        <div key={m.id} className={m.role === 'bot' ? 'chatbot-message chatbot-message-bot' : 'chatbot-message chatbot-message-user'}>
          {m.text}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
