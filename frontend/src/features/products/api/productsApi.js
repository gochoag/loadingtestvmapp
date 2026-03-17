export async function fetchProductsRequest(apiUrl) {
  const response = await fetch(`${apiUrl}/products`)

  if (!response.ok) {
    throw new Error('No se pudo cargar la lista de productos.')
  }

  return response.json()
}

export async function saveProductRequest(apiUrl, productId, payload) {
  const endpoint = productId ? `${apiUrl}/products/${productId}` : `${apiUrl}/products`
  const method = productId ? 'PUT' : 'POST'
  const response = await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('No se pudo guardar el producto.')
  }
}

export async function deleteProductRequest(apiUrl, productId) {
  const response = await fetch(`${apiUrl}/products/${productId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('No se pudo eliminar el producto.')
  }
}
