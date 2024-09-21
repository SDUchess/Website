import { useEffect, useState } from 'react'

// 47.104.224.71
export const baseURL = 'http://localhost:8080/api'

/**
 * 媒体查询
 */
export const useMedia = (query: string, initialValue = false) => {
  const [matches, setMatches] = useState(initialValue)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handleMatchChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handleMatchChange)
    return () => mediaQuery.removeEventListener('change', handleMatchChange)
  }, [query])

  return matches
}
