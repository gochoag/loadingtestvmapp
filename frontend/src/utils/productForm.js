export function validateProductForm(form) {
  if (!form.name.trim()) {
    return 'El nombre es obligatorio.'
  }

  if (form.price === '' || Number(form.price) < 0) {
    return 'El precio debe ser mayor o igual a 0.'
  }

  if (form.stock === '' || Number(form.stock) < 0) {
    return 'El stock debe ser mayor o igual a 0.'
  }

  return ''
}

export function buildProductPayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    stock: Number(form.stock),
  }
}

export function mapProductToForm(product) {
  return {
    name: product.name,
    description: product.description ?? '',
    price: String(product.price),
    stock: String(product.stock),
  }
}
