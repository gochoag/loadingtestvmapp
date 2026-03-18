import PanelHeader from '../../../components/PanelHeader'

function ProductsSection({
  editingId,
  form,
  products,
  paginatedProducts,
  loading,
  submitting,
  error,
  currentPage,
  totalPages,
  totalProducts,
  pageSize,
  formatMoney,
  onFormChange,
  onSubmit,
  onResetForm,
  onEdit,
  onDelete,
  onPageChange,
}) {
  const fieldClassName =
    'mt-2 block w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100'
  const secondaryButtonClassName =
    'rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
  const primaryButtonClassName =
    'rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60'
  const dangerButtonClassName =
    'rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700'
  const firstVisibleItem = totalProducts === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastVisibleItem = Math.min(currentPage * pageSize, totalProducts)

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <section className="border border-slate-200 bg-white p-5 shadow-sm">
        <PanelHeader
          title={editingId ? 'Editar producto' : 'Nuevo producto'}
          description="Administra el catalogo sin salir del panel principal."
        />
        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Nombre
            <input
              name="name"
              value={form.name}
              onChange={onFormChange}
              placeholder="Ej. Teclado mecanico"
              maxLength={120}
              className={fieldClassName}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Descripcion
            <textarea
              name="description"
              value={form.description}
              onChange={onFormChange}
              placeholder="Descripcion opcional"
              maxLength={500}
              className={`${fieldClassName} min-h-28 resize-y`}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Precio
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={onFormChange}
                className={fieldClassName}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={onFormChange}
                className={fieldClassName}
              />
            </label>
          </div>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <button
              type="submit"
              disabled={submitting}
              className={primaryButtonClassName}
            >
              {submitting
                ? 'Guardando...'
                : editingId
                  ? 'Actualizar producto'
                  : 'Crear producto'}
            </button>
            {editingId && (
              <button
                type="button"
                className={secondaryButtonClassName}
                onClick={onResetForm}
                disabled={submitting}
              >
                Cancelar edicion
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="border border-slate-200 bg-white p-5 shadow-sm">
        <PanelHeader
          title="Listado general"
          description="Consulta y actualiza cada registro desde la misma vista."
        />
        {error && <p className="mt-5 text-sm font-medium text-rose-600">{error}</p>}
        {loading ? (
          <p className="mt-5 text-sm text-slate-500">Cargando productos...</p>
        ) : products.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">No hay productos registrados.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    ID
                  </th>
                  <th className="border-b border-slate-200 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Nombre
                  </th>
                  <th className="border-b border-slate-200 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Descripcion
                  </th>
                  <th className="border-b border-slate-200 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Precio
                  </th>
                  <th className="border-b border-slate-200 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Stock
                  </th>
                  <th className="border-b border-slate-200 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="align-top">
                    <td className="border-b border-slate-200 px-3 py-4 text-sm text-slate-600">
                      {product.id}
                    </td>
                    <td className="border-b border-slate-200 px-3 py-4 text-sm font-medium text-slate-950">
                      {product.name}
                    </td>
                    <td className="border-b border-slate-200 px-3 py-4 text-sm text-slate-600">
                      {product.description || '-'}
                    </td>
                    <td className="border-b border-slate-200 px-3 py-4 text-sm text-slate-950">
                      {formatMoney(product.price)}
                    </td>
                    <td className="border-b border-slate-200 px-3 py-4 text-sm text-slate-950">
                      {product.stock}
                    </td>
                    <td className="border-b border-slate-200 px-3 py-4">
                      <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={secondaryButtonClassName}
                        onClick={() => onEdit(product)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={dangerButtonClassName}
                        onClick={() => onDelete(product.id)}
                      >
                        Eliminar
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {`Mostrando ${firstVisibleItem}-${lastVisibleItem} de ${totalProducts} productos`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={secondaryButtonClassName}
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Anterior
                </button>
                <span className="px-2 text-sm font-medium text-slate-700">
                  {`Pagina ${currentPage} de ${totalPages}`}
                </span>
                <button
                  type="button"
                  className={secondaryButtonClassName}
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default ProductsSection
