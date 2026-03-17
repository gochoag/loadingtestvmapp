import PanelHeader from '../../../components/PanelHeader'

function InventorySection({ metrics }) {
  return (
    <div className="content-grid inventory-grid">
      <section className="panel-card">
        <PanelHeader
          title="Alertas de reposicion"
          description="Elementos que necesitan seguimiento inmediato."
        />
        {metrics.lowStock.length === 0 ? (
          <p className="empty-state">No hay productos con stock critico.</p>
        ) : (
          <div className="list-stack">
            {metrics.lowStock.map((product) => (
              <article key={product.id} className="list-row">
                <div>
                  <strong>{product.name}</strong>
                  <p>{product.description || 'Sin descripcion'}</p>
                </div>
                <div className="list-meta warning">
                  <span>{product.stock} uds</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel-card">
        <PanelHeader
          title="Distribucion rapida"
          description="Lectura compacta del nivel de existencias."
        />
        <div className="mini-stats">
          <article>
            <span>Critico</span>
            <strong>{metrics.lowStock.length}</strong>
          </article>
          <article>
            <span>Estable</span>
            <strong>{metrics.stableProducts.length}</strong>
          </article>
          <article>
            <span>Sin stock</span>
            <strong>{metrics.outOfStockProducts.length}</strong>
          </article>
        </div>
      </section>
    </div>
  )
}

export default InventorySection
