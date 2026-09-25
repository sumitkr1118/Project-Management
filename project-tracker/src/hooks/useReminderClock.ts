import { useEffect, useState } from 'react'

/** Forces re-evaluation of time-dependent reminder logic every 5 minutes while mounted. */
export function useReminderClock(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  return now
}
