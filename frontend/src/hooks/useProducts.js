import { useCallback, useEffect, useState } from 'react'
import { INITIAL_PRODUCT_FORM } from '../shared/constants/products'
import {
  deleteProductRequest,
  fetchProductsRequest,
  saveProductRequest,
} from '../features/products/api/productsApi'
import {
  buildProductPayload,
  mapProductToForm,
  validateProductForm,
} from '../utils/productForm'

export function useProducts({ apiUrl, user, onProductSaved }) {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(INITIAL_PRODUCT_FORM)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const resetForm = useCallback(() => {
    setForm(INITIAL_PRODUCT_FORM)
    setEditingId(null)
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      setError('')
      setLoading(true)
      const data = await fetchProductsRequest(apiUrl)
      setProducts(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [apiUrl])

  useEffect(() => {
    if (!user) {
      setProducts([])
      setLoading(false)
      setError('')
      resetForm()
      return
    }

    fetchProducts()
  }, [fetchProducts, resetForm, user])

  const onFormChange = useCallback((event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }, [])

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault()

      const validationError = validateProductForm(form)
      if (validationError) {
        setError(validationError)
        return
      }

      try {
        setError('')
        setSubmitting(true)
        await saveProductRequest(apiUrl, editingId, buildProductPayload(form))
        await fetchProducts()
        resetForm()
        onProductSaved()
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setSubmitting(false)
      }
    },
    [apiUrl, editingId, fetchProducts, form, onProductSaved, resetForm],
  )

  const onEdit = useCallback((product) => {
    setForm(mapProductToForm(product))
    setEditingId(product.id)
    onProductSaved()
  }, [onProductSaved])

  const onDelete = useCallback(
    async (productId) => {
      try {
        setError('')
        await deleteProductRequest(apiUrl, productId)
        await fetchProducts()
        if (editingId === productId) {
          resetForm()
        }
      } catch (requestError) {
        setError(requestError.message)
      }
    },
    [apiUrl, editingId, fetchProducts, resetForm],
  )

  return {
    products,
    form,
    editingId,
    loading,
    submitting,
    error,
    resetForm,
    onFormChange,
    onSubmit,
    onEdit,
    onDelete,
  }
}
