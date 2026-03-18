import PanelHeader from '../../../components/PanelHeader'

function InventorySection({ metrics }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
      <section className="border border-slate-200 bg-white p-5 shadow-sm">
        <PanelHeader
          title="Alertas de reposicion"
          description="Elementos que necesitan seguimiento inmediato."
        />
        {metrics.lowStock.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">No hay productos con stock critico.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {metrics.lowStock.map((product) => (
              <article
                key={product.id}
                className="flex flex-col gap-4 border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <strong className="block text-sm font-semibold text-slate-950">
                    {product.name}
                  </strong>
                  <p className="mt-1 text-sm text-slate-600">
                    {product.description || 'Sin descripcion'}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
                    {product.stock} uds
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border border-slate-200 bg-white p-5 shadow-sm">
        <PanelHeader
          title="Distribucion rapida"
          description="Lectura compacta del nivel de existencias."
        />
        <div className="mt-5 grid gap-3">
          <article className="border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Critico
            </span>
            <strong className="mt-2 block text-2xl font-semibold tracking-tight text-slate-950">
              {metrics.lowStock.length}
            </strong>
          </article>
          <article className="border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Estable
            </span>
            <strong className="mt-2 block text-2xl font-semibold tracking-tight text-slate-950">
              {metrics.stableProducts.length}
            </strong>
          </article>
          <article className="border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Sin stock
            </span>
            <strong className="mt-2 block text-2xl font-semibold tracking-tight text-slate-950">
              {metrics.outOfStockProducts.length}
            </strong>
          </article>
        </div>
      </section>
    </div>
  )
}

export default InventorySection
