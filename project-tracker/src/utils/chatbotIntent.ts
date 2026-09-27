/** [phrase, weight] — weight lets a rare/specific noun (e.g. "blocker") outrank a generic one ("project") when a sentence mentions both. */
type WeightedPhrase = [phrase: string, weight: number]

export function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((p) => text.includes(p))
}

/**
 * Forgiving intent scorer: requires at least one action verb AND at least one noun phrase,
 * order-independent, so "please create a new project" and "I'd like to set up a project" both match.
 * Returns 0 when no verb is present at all (keeps this from firing on plain questions).
 */
export function actionScore(text: string, verbs: string[], nouns: WeightedPhrase[]): number {
  if (!includesAny(text, verbs)) return 0
  const nounWeight = nouns.reduce((sum, [phrase, weight]) => text.includes(phrase) ? sum + weight : sum, 0)
  return nounWeight > 0 ? 1 + nounWeight : 0
}

export const CREATE_VERBS = ['onboard', 'add', 'create', 'new', 'register', 'set up', 'setup', 'make', 'start', 'sign up', 'signup']
export const UPDATE_VERBS = ['update', 'change', 'set', 'edit', 'modify', 'revise', 'mark']
export const ASSIGN_VERBS = ['assign', 'allocate', 'hand over', 'handover', 'reassign', 'give']
export const SUBMIT_VERBS = ['submit', 'log', 'record', 'file', 'update', 'fill']
export const RAISE_VERBS = ['raise', 'report', 'log', 'add', 'create', 'file', 'open', 'flag']
export const RESOLVE_VERBS = ['resolve', 'close', 'fix', 'update', 'escalate', 'mark']
