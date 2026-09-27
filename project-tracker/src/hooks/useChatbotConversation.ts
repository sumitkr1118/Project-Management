import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useTeam } from '../context/TeamContext'
import { answerQuery } from '../utils/chatbotEngine'
import { ACTIONS, detectActionIntent, describeCapabilities, type ActionContext } from '../utils/chatbotActions'

export interface ChatMessage {
  id: string
  role: 'bot' | 'user'
  text: string
}

interface PendingState {
  actionId: string
  collected: Record<string, string>
  fieldIndex: number
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function useChatbotConversation() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: generateId(), role: 'bot', text: 'Hi! Ask me about the portfolio, or ask me to do something for you — try "help" to see what\'s available to your role.' },
  ])
  const [pending, setPending] = useState<PendingState | null>(null)
  const [awaitingConfirm, setAwaitingConfirm] = useState(false)

  const { projects, domains, blockers, addProject, updateProject, addDomain, addBlocker, updateBlocker } = useApp()
  const { users, tasks, dailyUpdates, currentUser, addUser, submitDailyUpdate, getDailyUpdate } = useTeam()

  const ctx: ActionContext = {
    currentUser, users, projects, domains, tasks, blockers,
    addUser, addProject, updateProject, addDomain, addBlocker, updateBlocker,
    submitDailyUpdate, getDailyUpdate,
  }

  const pushBot = (text: string) => setMessages((prev) => [...prev, { id: generateId(), role: 'bot', text }])
  const pushUser = (text: string) => setMessages((prev) => [...prev, { id: generateId(), role: 'user', text }])

  function sendMessage(raw: string) {
    pushUser(raw)
    const text = raw.trim()

    if ((pending || awaitingConfirm) && /^(cancel|stop|nevermind)$/i.test(text)) {
      setPending(null)
      setAwaitingConfirm(false)
      pushBot('Cancelled.')
      return
    }

    if (awaitingConfirm && pending) {
      if (/^(y|yes|confirm|ok|okay)/i.test(text)) {
        const action = ACTIONS.find((a) => a.id === pending.actionId)!
        pushBot(action.execute(pending.collected, ctx))
      } else if (/^(n|no)/i.test(text)) {
        pushBot('Cancelled.')
      } else {
        pushBot('Please reply "yes" to confirm or "no" to cancel.')
        return
      }
      setPending(null)
      setAwaitingConfirm(false)
      return
    }

    if (pending) {
      const action = ACTIONS.find((a) => a.id === pending.actionId)!
      const field = action.fields[pending.fieldIndex]
      const resolved = field.resolve(text, ctx)
      if (!resolved.ok) { pushBot(resolved.error); return }

      const collected = { ...pending.collected, [field.key]: resolved.value }
      const nextIndex = pending.fieldIndex + 1
      if (nextIndex < action.fields.length) {
        setPending({ actionId: action.id, collected, fieldIndex: nextIndex })
        pushBot(action.fields[nextIndex].prompt)
      } else {
        setPending({ actionId: action.id, collected, fieldIndex: nextIndex })
        setAwaitingConfirm(true)
        pushBot(`${action.summarize(collected, ctx)}\n\nConfirm? (yes/no)`)
      }
      return
    }

    if (/^help$|what can you do/i.test(text)) {
      pushBot(`I can answer questions about the portfolio, and I can do things for you:\n${describeCapabilities(currentUser)}`)
      return
    }

    const matched = detectActionIntent(text)
    if (matched) {
      if (!matched.allow(currentUser)) {
        pushBot(`That's not something your role (${currentUser.role}) can do. Here's what you can ask me to do:\n${describeCapabilities(currentUser)}`)
        return
      }
      setPending({ actionId: matched.id, collected: {}, fieldIndex: 0 })
      pushBot(matched.fields[0].prompt)
      return
    }

    pushBot(answerQuery(text, { projects, domains, blockers, users, tasks, dailyUpdates, currentUser }))
  }

  return { messages, sendMessage }
}
