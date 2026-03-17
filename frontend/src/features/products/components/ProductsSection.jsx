import PanelHeader from '../../../components/PanelHeader'

function ProductsSection({
  editingId,
  form,
  products,
  loading,
  submitting,
  error,
  formatMoney,
  onFormChange,
  onSubmit,
  onResetForm,
  onEdit,
  onDelete,
}) {
  return (
    <div className="content-grid products-layout">
      <section className="panel-card">
        <PanelHeader
          title={editingId ? 'Editar producto' : 'Nuevo producto'}
          description="Administra el catalogo sin salir del panel principal."
        />
        <form className="form" onSubmit={onSubmit}>
          <label>
            Nombre
            <input
              name="name"
              value={form.name}
              onChange={onFormChange}
              placeholder="Ej. Teclado mecanico"
              maxLength={120}
            />
          </label>
          <label>
            Descripcion
            <textarea
              name="description"
              value={form.description}
              onChange={onFormChange}
              placeholder="Descripcion opcional"
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
                onChange={onFormChange}
              />
            </label>
            <label>
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={onFormChange}
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
                onClick={onResetForm}
                disabled={submitting}
              >
                Cancelar edicion
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel-card">
        <PanelHeader
          title="Listado general"
          description="Consulta y actualiza cada registro desde la misma vista."
        />
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p className="empty-state">Cargando productos...</p>
        ) : products.length === 0 ? (
          <p className="empty-state">No hay productos registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripcion</th>
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
                    <td>{formatMoney(product.price)}</td>
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
    </div>
  )
}

export default ProductsSection
