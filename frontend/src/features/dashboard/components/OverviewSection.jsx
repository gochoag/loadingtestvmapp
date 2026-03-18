function OverviewSection({ metrics, loading, formatMoney, onOpenProducts }) {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_320px]">
        <div className="border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                Home
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Una vista ejecutiva, limpia y facil de leer.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Consulta el estado general del catalogo, detecta alertas y salta
                directo al modulo de productos cuando necesites editar.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
              onClick={onOpenProducts}
            >
              Ir a productos
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <article className="border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Productos
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {metrics.totalProducts}
              </p>
              <p className="mt-1 text-sm text-slate-600">Referencias activas.</p>
            </article>
            <article className="border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Stock
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {metrics.totalUnits}
              </p>
              <p className="mt-1 text-sm text-slate-600">Unidades acumuladas.</p>
            </article>
            <article className="border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Valor
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {formatMoney(metrics.totalValue)}
              </p>
              <p className="mt-1 text-sm text-slate-600">Proyeccion de catalogo.</p>
            </article>
          </div>
        </div>

        <aside className="border border-slate-200 bg-slate-900 px-6 py-5 text-white shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
            Atencion inmediata
          </p>
          <p className="mt-3 text-4xl font-semibold">
            {metrics.lowStock.length}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            productos requieren seguimiento por stock bajo.
          </p>

          <div className="mt-8 space-y-4 border-t border-white/10 pt-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300">Cobertura media</span>
              <strong className="text-white">{metrics.averageCoverage} uds</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300">Precio promedio</span>
              <strong className="text-white">
                {formatMoney(metrics.averagePrice)}
              </strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <section className="border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Productos destacados
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Los registros con mejor disponibilidad.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500">Cargando productos...</p>
            ) : metrics.topProducts.length === 0 ? (
              <p className="text-sm text-slate-500">
                No hay datos para mostrar todavia.
              </p>
            ) : (
              metrics.topProducts.map((product) => (
                <article
                  key={product.id}
                  className="flex items-center justify-between gap-4 border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {product.name}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-600">
                      {product.description || 'Sin descripcion'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-950">
                      {product.stock} uds
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatMoney(product.price)}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-semibold text-slate-950">
              Alertas de reposicion
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Seguimiento de productos con cobertura limitada.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {metrics.lowStock.length === 0 ? (
              <p className="text-sm text-slate-500">
                No hay productos con stock critico.
              </p>
            ) : (
              metrics.lowStock.slice(0, 5).map((product) => (
                <article
                  key={product.id}
                  className="flex items-center justify-between gap-4 border border-slate-200 px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {product.name}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-600">
                      {product.description || 'Sin descripcion'}
                    </p>
                  </div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-800">
                    {product.stock} uds
                  </span>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </div>
  )
}

export default OverviewSection
