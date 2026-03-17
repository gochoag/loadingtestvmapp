import PanelHeader from '../../../components/PanelHeader'

function OverviewSection({ metrics, loading, formatMoney, onOpenProducts }) {
  return (
    <div className="content-grid">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Workspace</span>
          <h2>Tu operacion entra primero por login y aterriza en un panel central.</h2>
          <p>
            Desde aqui controlas el catalogo, revisas existencias y navegas con
            un sidebar lateral que puedes abrir o cerrar desde el header.
          </p>
        </div>
        <div className="hero-metrics">
          <article>
            <span>Productos</span>
            <strong>{metrics.totalProducts}</strong>
          </article>
          <article>
            <span>Unidades</span>
            <strong>{metrics.totalUnits}</strong>
          </article>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-label">Catalogo activo</span>
          <strong>{metrics.totalProducts}</strong>
          <p>Referencias disponibles en el panel.</p>
        </article>
        <article className="stat-card">
          <span className="stat-label">Stock total</span>
          <strong>{metrics.totalUnits}</strong>
          <p>Unidades sumadas en inventario.</p>
        </article>
        <article className="stat-card">
          <span className="stat-label">Valor estimado</span>
          <strong>{formatMoney(metrics.totalValue)}</strong>
          <p>Proyeccion basada en precio por stock.</p>
        </article>
        <article className="stat-card alert-card">
          <span className="stat-label">Alertas</span>
          <strong>{metrics.lowStock.length}</strong>
          <p>Productos con 5 unidades o menos.</p>
        </article>
      </section>

      <section className="panel-card">
        <PanelHeader
          title="Productos destacados"
          description="Los registros con mayor disponibilidad actual."
          action={
            <button type="button" className="secondary" onClick={onOpenProducts}>
              Ir a productos
            </button>
          }
        />
        {loading ? (
          <p className="empty-state">Cargando productos...</p>
        ) : metrics.topProducts.length === 0 ? (
          <p className="empty-state">No hay datos para mostrar todavia.</p>
        ) : (
          <div className="list-stack">
            {metrics.topProducts.map((product) => (
              <article key={product.id} className="list-row">
                <div>
                  <strong>{product.name}</strong>
                  <p>{product.description || 'Sin descripcion'}</p>
                </div>
                <div className="list-meta">
                  <span>{product.stock} uds</span>
                  <strong>{formatMoney(product.price)}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default OverviewSection
