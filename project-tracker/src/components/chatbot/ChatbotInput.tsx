import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatbotInputProps {
  onSend: (text: string) => void
}

export default function ChatbotInput({ onSend }: ChatbotInputProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="chatbot-input-row">
      <input
        className="form-input"
        placeholder="Ask about a project or the portfolio..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn btn-primary btn-icon" aria-label="Send">
        <Send size={16} />
      </button>
    </form>
  )
}
