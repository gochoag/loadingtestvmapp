import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchCurrentUserRequest, loginRequest } from '../api/authApi'
import { AUTH_STORAGE_KEY } from '../../../shared/config/api'

const INITIAL_LOGIN_FORM = {
  email: '',
  password: '',
}

function readStoredSession() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!rawSession) {
      return null
    }

    const parsedSession = JSON.parse(rawSession)
    if (!parsedSession?.token || !parsedSession?.user) {
      return null
    }

    return parsedSession
  } catch {
    return null
  }
}

function persistSession(session) {
  if (typeof window === 'undefined') {
    return
  }

  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function useAuthSession({
  apiUrl,
  onLoginSuccess,
  onLogoutSuccess,
  onNotify,
} = {}) {
  const [session, setSession] = useState(() => readStoredSession())
  const [loginForm, setLoginForm] = useState(INITIAL_LOGIN_FORM)
  const [loginError, setLoginError] = useState('')
  const [authLoading, setAuthLoading] = useState(() => Boolean(readStoredSession()?.token))

  const user = session?.user ?? null
  const token = session?.token ?? ''

  const onLoginChange = useCallback((event) => {
    const { name, value } = event.target
    setLoginForm((previous) => ({ ...previous, [name]: value }))
  }, [])

  useEffect(() => {
    if (!token || !apiUrl) {
      setAuthLoading(false)
      return
    }

    let cancelled = false

    async function restoreSession() {
      try {
        setAuthLoading(true)
        const currentUser = await fetchCurrentUserRequest(apiUrl, token)
        if (cancelled) {
          return
        }

        const restoredSession = { token, user: currentUser }
        setSession(restoredSession)
        persistSession(restoredSession)
      } catch {
        if (cancelled) {
          return
        }

        setSession(null)
        persistSession(null)
      } finally {
        if (!cancelled) {
          setAuthLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [apiUrl, token])

  const onLoginSubmit = useCallback(
    async (event) => {
      event.preventDefault()

      if (!loginForm.email.trim() || !loginForm.password.trim()) {
        const message = 'Ingresa correo y contrasena para continuar.'
        setLoginError(message)
        onNotify?.({
          type: 'error',
          message,
        })
        return
      }

      try {
        setLoginError('')
        setAuthLoading(true)

        const authPayload = await loginRequest(apiUrl, {
          email: loginForm.email.trim(),
          password: loginForm.password,
        })

        const nextSession = {
          token: authPayload.token,
          user: authPayload.user,
        }

        setSession(nextSession)
        persistSession(nextSession)
        setLoginForm(INITIAL_LOGIN_FORM)
        onLoginSuccess?.()
        onNotify?.({
          type: 'success',
          message: `Bienvenido, ${authPayload.user.name}.`,
        })
      } catch (requestError) {
        setLoginError(requestError.message)
        onNotify?.({
          type: 'error',
          message: requestError.message,
        })
      } finally {
        setAuthLoading(false)
      }
    },
    [apiUrl, loginForm.email, loginForm.password, onLoginSuccess, onNotify],
  )

  const onLogout = useCallback(() => {
    setSession(null)
    persistSession(null)
    setLoginForm(INITIAL_LOGIN_FORM)
    setLoginError('')
    onLogoutSuccess?.()
    onNotify?.({
      type: 'info',
      message: 'Sesion cerrada correctamente.',
    })
  }, [onLogoutSuccess, onNotify])

  return useMemo(() => ({
    token,
    user,
    loginForm,
    loginError,
    authLoading,
    onLoginChange,
    onLoginSubmit,
    onLogout,
  }), [authLoading, loginError, loginForm, onLoginChange, onLoginSubmit, onLogout, token, user])
}
