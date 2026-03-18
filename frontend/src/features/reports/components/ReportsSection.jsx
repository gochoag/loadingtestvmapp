import PanelHeader from '../../../components/PanelHeader'

function ReportsSection({ metrics, formatMoney }) {
  return (
    <div className="grid gap-5">
      <section className="border border-slate-200 bg-white p-5 shadow-sm">
        <PanelHeader
          title="Indicadores del panel"
          description="Resumen ejecutivo generado desde los datos actuales."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <article className="border border-slate-200 bg-slate-50 px-5 py-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Ticket promedio
            </span>
            <strong className="mt-2 block text-2xl font-semibold tracking-tight text-slate-950">
              {formatMoney(metrics.averagePrice)}
            </strong>
          </article>
          <article className="border border-slate-200 bg-slate-50 px-5 py-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Cobertura media
            </span>
            <strong className="mt-2 block text-2xl font-semibold tracking-tight text-slate-950">
              {`${metrics.averageCoverage} uds`}
            </strong>
          </article>
          <article className="border border-slate-200 bg-slate-50 px-5 py-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Valor del catalogo
            </span>
            <strong className="mt-2 block text-2xl font-semibold tracking-tight text-slate-950">
              {formatMoney(metrics.totalValue)}
            </strong>
          </article>
        </div>
      </section>
    </div>
  )
}

export default ReportsSection
