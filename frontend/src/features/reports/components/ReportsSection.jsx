import PanelHeader from '../../../components/PanelHeader'

function ReportsSection({ metrics, formatMoney }) {
  return (
    <div className="content-grid">
      <section className="panel-card">
        <PanelHeader
          title="Indicadores del panel"
          description="Resumen ejecutivo generado desde los datos actuales."
        />
        <div className="report-grid">
          <article className="report-card">
            <span>Ticket promedio</span>
            <strong>{formatMoney(metrics.averagePrice)}</strong>
          </article>
          <article className="report-card">
            <span>Cobertura media</span>
            <strong>{`${metrics.averageCoverage} uds`}</strong>
          </article>
          <article className="report-card">
            <span>Valor del catalogo</span>
            <strong>{formatMoney(metrics.totalValue)}</strong>
          </article>
        </div>
      </section>
    </div>
  )
}

export default ReportsSection
