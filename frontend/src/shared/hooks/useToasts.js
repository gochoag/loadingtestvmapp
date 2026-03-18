import { useCallback, useEffect, useRef, useState } from 'react'

const TOAST_DURATION_MS = 3800

export function useToasts() {
  const [toasts, setToasts] = useState([])
  const nextToastId = useRef(1)
  const timersRef = useRef(new Map())

  const dismissToast = useCallback((toastId) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== toastId))
  }, [])

  const pushToast = useCallback(
    ({ message, type = 'info', duration = TOAST_DURATION_MS }) => {
      const safeMessage = String(message || '').trim()
      if (!safeMessage) {
        return
      }

      const toastId = nextToastId.current
      nextToastId.current += 1

      setToasts((previous) => [
        ...previous,
        {
          id: toastId,
          message: safeMessage,
          type,
          duration,
        },
      ])

      const timerId = window.setTimeout(() => {
        timersRef.current.delete(toastId)
        dismissToast(toastId)
      }, duration)
      timersRef.current.set(toastId, timerId)
    },
    [dismissToast],
  )

  useEffect(() => {
    const timers = timersRef.current

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId))
      timers.clear()
    }
  }, [])

  const dismissToastWithCleanup = useCallback((toastId) => {
    const timerId = timersRef.current.get(toastId)
    if (timerId) {
      window.clearTimeout(timerId)
      timersRef.current.delete(toastId)
    }

    dismissToast(toastId)
  }, [dismissToast])

  return {
    toasts,
    pushToast,
    dismissToast: dismissToastWithCleanup,
  }
}
