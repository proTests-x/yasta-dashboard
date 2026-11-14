const bars = [34, 52, 43, 69, 58, 82, 72, 94];

export function DashboardPreview() {
  return (
    <div className="product-orbit" aria-label="Vista previa del panel financiero de yasta">
      <span className="product-orbit__ring product-orbit__ring--one" />
      <span className="product-orbit__ring product-orbit__ring--two" />
      <div className="dashboard-preview">
        <div className="dashboard-preview__top">
          <div className="preview-brand"><span>👏</span><b>yasta</b></div>
          <span className="preview-date">SEPTIEMBRE 2026</span>
          <span className="preview-avatar">VC</span>
        </div>
        <div className="dashboard-preview__body">
          <div className="preview-heading">
            <div><span>RESUMEN DEL MES</span><h2>Todo claro, Valeria.</h2></div>
            <button type="button" tabIndex={-1}>+ Nuevo movimiento</button>
          </div>
          <div className="preview-kpis">
            <article><span>INGRESOS</span><strong>S/ 9,074</strong><small>↗ 12 ventas registradas</small></article>
            <article><span>EGRESOS</span><strong>S/ 1,780</strong><small>Dentro de lo previsto</small></article>
            <article className="preview-kpis__featured"><span>UTILIDAD NETA</span><strong>S/ 7,294</strong><small>80.4% de margen</small></article>
          </div>
          <div className="preview-lower">
            <article className="preview-flow">
              <div><span>FLUJO DEL NEGOCIO</span><small>Últimos 8 días</small></div>
              <div className="preview-bars">
                {bars.map((height, index) => <i key={index} style={{ "--bar-height": `${height}%` } as React.CSSProperties} />)}
              </div>
            </article>
            <article className="preview-health">
              <span>SALUD FINANCIERA</span>
              <div className="health-ring"><strong>80</strong><small>/ 100</small></div>
              <p><i /> Tu negocio se ve saludable</p>
            </article>
          </div>
        </div>
      </div>
      <div className="floating-signal floating-signal--income"><span>↗</span><div><small>VENTA REGISTRADA</small><strong>+ S/ 680.00</strong></div></div>
      <div className="floating-signal floating-signal--goal"><span>73%</span><div><small>META DEL MES</small><strong>Vas por buen camino</strong></div></div>
    </div>
  );
}
