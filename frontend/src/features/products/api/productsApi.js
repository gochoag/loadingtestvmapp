import { createJsonRequestOptions, parseApiResponse } from '../../../shared/api/http'

export async function fetchProductsRequest(apiUrl, token) {
  const response = await fetch(
    `${apiUrl}/products`,
    createJsonRequestOptions({ token }),
  )

  return parseApiResponse(response, 'No se pudo cargar la lista de productos.')
}

export async function saveProductRequest(apiUrl, token, productId, payload) {
  const endpoint = productId ? `${apiUrl}/products/${productId}` : `${apiUrl}/products`
  const method = productId ? 'PUT' : 'POST'
  const response = await fetch(
    endpoint,
    createJsonRequestOptions({
      method,
      token,
      body: payload,
    }),
  )

  await parseApiResponse(response, 'No se pudo guardar el producto.')
}

export async function deleteProductRequest(apiUrl, token, productId) {
  const response = await fetch(
    `${apiUrl}/products/${productId}`,
    createJsonRequestOptions({
      method: 'DELETE',
      token,
    }),
  )

  await parseApiResponse(response, 'No se pudo eliminar el producto.')
}
