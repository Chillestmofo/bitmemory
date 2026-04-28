import { useState, useCallback } from 'react'

let id = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'default', duration = 3000) => {
    const newId = ++id
    setToasts(prev => [...prev, { id: newId, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newId))
    }, duration)
  }, [])

  return { toasts, toast }
}
