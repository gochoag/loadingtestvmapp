import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  INITIAL_PRODUCT_FORM,
  PRODUCTS_PAGE_SIZE,
} from '../../../shared/constants/products'
import {
  deleteProductRequest,
  fetchProductsRequest,
  saveProductRequest,
} from '../api/productsApi'
import {
  buildProductPayload,
  mapProductToForm,
  validateProductForm,
} from '../utils/productForm'

export function useProducts({
  apiUrl,
  user,
  token,
  onProductSaved,
  onNotify,
}) {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(INITIAL_PRODUCT_FORM)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const resetForm = useCallback(() => {
    setForm(INITIAL_PRODUCT_FORM)
    setEditingId(null)
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      setError('')
      setLoading(true)
      const data = await fetchProductsRequest(apiUrl, token)
      setProducts(data)
      return true
    } catch (requestError) {
      setError(requestError.message)
      onNotify?.({
        type: 'error',
        message: requestError.message,
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [apiUrl, onNotify, token])

  useEffect(() => {
    if (!user || !token) {
      setProducts([])
      setLoading(false)
      setError('')
      setCurrentPage(1)
      resetForm()
      return
    }

    fetchProducts()
  }, [fetchProducts, resetForm, token, user])

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
        onNotify?.({
          type: 'error',
          message: validationError,
        })
        return
      }

      try {
        setError('')
        setSubmitting(true)
        const wasEditing = Boolean(editingId)
        await saveProductRequest(apiUrl, token, editingId, buildProductPayload(form))
        await fetchProducts()
        resetForm()
        onProductSaved()
        onNotify?.({
          type: 'success',
          message: wasEditing
            ? 'Producto actualizado correctamente.'
            : 'Producto creado correctamente.',
        })
      } catch (requestError) {
        setError(requestError.message)
        onNotify?.({
          type: 'error',
          message: requestError.message,
        })
      } finally {
        setSubmitting(false)
      }
    },
    [
      apiUrl,
      editingId,
      fetchProducts,
      form,
      onNotify,
      onProductSaved,
      resetForm,
      token,
    ],
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
        await deleteProductRequest(apiUrl, token, productId)
        await fetchProducts()
        if (editingId === productId) {
          resetForm()
        }
        onNotify?.({
          type: 'success',
          message: 'Producto eliminado correctamente.',
        })
      } catch (requestError) {
        setError(requestError.message)
        onNotify?.({
          type: 'error',
          message: requestError.message,
        })
      }
    },
    [apiUrl, editingId, fetchProducts, onNotify, resetForm, token],
  )

  const totalProducts = products.length
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalProducts / PRODUCTS_PAGE_SIZE)),
    [totalProducts],
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PAGE_SIZE
    return products.slice(start, start + PRODUCTS_PAGE_SIZE)
  }, [currentPage, products])

  const onPageChange = useCallback(
    (page) => {
      const safePage = Number(page)
      if (!Number.isInteger(safePage)) {
        return
      }

      if (safePage < 1 || safePage > totalPages) {
        return
      }

      setCurrentPage(safePage)
    },
    [totalPages],
  )

  return {
    products,
    paginatedProducts,
    form,
    editingId,
    loading,
    submitting,
    error,
    currentPage,
    totalPages,
    totalProducts,
    pageSize: PRODUCTS_PAGE_SIZE,
    resetForm,
    onFormChange,
    onSubmit,
    onEdit,
    onDelete,
    onPageChange,
  }
}
