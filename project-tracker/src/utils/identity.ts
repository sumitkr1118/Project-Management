export interface ResolvedIdentity {
  email?: string
  name?: string
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timed out')), timeoutMs)
    promise.then((v) => { clearTimeout(timer); resolve(v) }, (e) => { clearTimeout(timer); reject(e) })
  })
}

export async function resolvePowerPlatformIdentity(timeoutMs = 2000): Promise<ResolvedIdentity | null> {
  try {
    const { getContext } = await import('@microsoft/power-apps/app')
    const context = await withTimeout(getContext(), timeoutMs)
    const { fullName, userPrincipalName } = context.user
    if (!fullName && !userPrincipalName) return null
    return { name: fullName, email: userPrincipalName }
  } catch {
    return null
  }
}
