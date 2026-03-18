import { createJsonRequestOptions, parseApiResponse } from '../../../shared/api/http'

export async function loginRequest(apiUrl, credentials) {
  const response = await fetch(
    `${apiUrl}/auth/login`,
    createJsonRequestOptions({
      method: 'POST',
      body: credentials,
    }),
  )

  return parseApiResponse(response, 'No se pudo iniciar sesion.')
}

export async function fetchCurrentUserRequest(apiUrl, token) {
  const response = await fetch(
    `${apiUrl}/auth/me`,
    createJsonRequestOptions({ token }),
  )

  return parseApiResponse(response, 'No se pudo recuperar la sesion actual.')
}
