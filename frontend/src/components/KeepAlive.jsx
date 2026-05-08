import { useEffect, useRef } from 'react'

const BACKEND_URL = 'https://emergency-blood-finder-systemblood.onrender.com'
const PING_INTERVAL_MS = 13 * 60 * 1000 // 13 minutes

/**
 * KeepAlive — pings the Render free-tier backend every 13 minutes
 * so the server never goes to sleep while someone has the tab open.
 */
export default function KeepAlive() {
  const timerRef = useRef(null)

  useEffect(() => {
    const ping = () => {
      fetch(`${BACKEND_URL}/api/donors`, { method: 'HEAD', mode: 'no-cors' })
        .catch(() => {}) // silently ignore errors
    }

    // Warm-up ping immediately on first load
    ping()

    // Then ping every 13 minutes
    timerRef.current = setInterval(ping, PING_INTERVAL_MS)

    return () => clearInterval(timerRef.current)
  }, [])

  return null // renders nothing
}
