import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const API_URL = useMemo(
    () => import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
    [],
  )
  const initialForm = {
    name: '',
    description: '',
    price: '',
    stock: '',
  }
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchProducts = useCallback(async () => {
    try {
      setError('')
      setLoading(true)
      const response = await fetch(`${API_URL}/products`)
      if (!response.ok) {
        throw new Error('No se pudo cargar la lista de productos.')
      }
      const data = await response.json()
      setProducts(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('El nombre es obligatorio.')
      return
    }
    if (form.price === '' || Number(form.price) < 0) {
      setError('El precio debe ser mayor o igual a 0.')
      return
    }
    if (form.stock === '' || Number(form.stock) < 0) {
      setError('El stock debe ser mayor o igual a 0.')
      return
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    }

    const endpoint = editingId
      ? `${API_URL}/products/${editingId}`
      : `${API_URL}/products`
    const method = editingId ? 'PUT' : 'POST'

    try {
      setError('')
      setSubmitting(true)
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('No se pudo guardar el producto.')
      }

      await fetchProducts()
      resetForm()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const onEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
      stock: String(product.stock),
    })
    setEditingId(product.id)
  }

  const onDelete = async (productId) => {
    try {
      setError('')
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('No se pudo eliminar el producto.')
      }
      await fetchProducts()
      if (editingId === productId) {
        resetForm()
      }
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="app">
      <header className="header">
        <h1>CRUD de Productos</h1>
        <p>React + Go + PostgreSQL</p>
      </header>

      <section className="card">
        <h2>{editingId ? 'Editar producto' : 'Nuevo producto'}</h2>
        <form className="form" onSubmit={onSubmit}>
          <label>
            Nombre
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Ej. Teclado mecánico"
              maxLength={120}
            />
          </label>
          <label>
            Descripción
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Descripción opcional"
              maxLength={500}
            />
          </label>
          <div className="row">
            <label>
              Precio
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={onChange}
              />
            </label>
            <label>
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={onChange}
              />
            </label>
          </div>
          <div className="actions">
            <button type="submit" disabled={submitting}>
              {submitting
                ? 'Guardando...'
                : editingId
                  ? 'Actualizar producto'
                  : 'Crear producto'}
            </button>
            {editingId && (
              <button
                type="button"
                className="secondary"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Listado</h2>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Cargando productos...</p>
        ) : products.length === 0 ? (
          <p>No hay productos registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description || '-'}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => onEdit(product)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => onDelete(product.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
