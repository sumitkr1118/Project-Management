import type { User } from '../types'
import { ONBOARDING_ACTIONS } from './chatbotActionsOnboarding'
import { OPS_ACTIONS } from './chatbotActionsOps'
import type { ActionSpec } from './chatbotActionTypes'

export type { ActionSpec, ActionContext } from './chatbotActionTypes'

export const ACTIONS: ActionSpec[] = [...ONBOARDING_ACTIONS, ...OPS_ACTIONS]

export function detectActionIntent(text: string): ActionSpec | undefined {
  const q = text.toLowerCase()
  let best: ActionSpec | undefined
  let bestScore = 0
  for (const action of ACTIONS) {
    const score = action.match(q)
    if (score > bestScore) { best = action; bestScore = score }
  }
  return best
}

export function describeCapabilities(user: User): string {
  const mine = ACTIONS.filter((a) => a.allow(user))
  if (mine.length === 0) return 'No actions are available for your role.'
  return mine.map((a) => `• Ask me to ${a.description}`).join('\n')
}
