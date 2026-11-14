import { DashboardPreview } from "@/components/DashboardPreview";
import { Logo } from "@/components/Logo";
import { VectorField } from "@/components/VectorField";
import { getPlans } from "@/lib/api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";

export default async function HomePage() {
  const plans = await getPlans();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "yasta",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description: "Control financiero simple para negocios peruanos.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "PEN" }
  };

  return (
    <main>
      <section className="hero">
        <VectorField />
        <header className="site-header shell">
          <Logo inverted />
          <nav aria-label="Navegación principal">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#planes">Planes</a>
            <a href="#privacidad">Privacidad</a>
          </nav>
          <div className="site-header__actions">
            <a className="text-action" href="/ingresar">Ingresar</a>
            <a className="button button--small button--light" href="/crear-cuenta">Empezar gratis</a>
          </div>
        </header>

        <div className="hero__content shell">
          <div className="hero__copy">
            <div className="eyebrow"><i /> CONTROL FINANCIERO, SIN COMPLICARTE</div>
            <h1>Tus números alineados.<br /><em>Tu negocio en movimiento.</em></h1>
            <p>Registra lo que entra, controla lo que sale y decide con claridad. Una sola vista para entender tu negocio de verdad.</p>
            <div className="hero__actions">
              <a className="button button--orange" href="/crear-cuenta">Crear mi espacio gratis <span>→</span></a>
              <a className="play-link" href="#como-funciona"><i>▶</i> Ver cómo funciona</a>
            </div>
            <div className="hero__trust"><span>Sin tarjeta</span><span>Listo en minutos</span><span>Datos privados</span></div>
          </div>
          <DashboardPreview />
        </div>

        <div className="signal-strip">
          <div className="shell signal-strip__inner">
            <div><strong>50</strong><span>movimientos gratis<br />cada mes</span></div>
            <i />
            <div><strong>3</strong><span>indicadores clave<br />en una vista</span></div>
            <i />
            <div><strong>&lt;1 min</strong><span>para registrar<br />cada movimiento</span></div>
          </div>
        </div>
      </section>

      <section className="intro-section shell" id="como-funciona">
        <span className="section-kicker">DE LOS DATOS A LA DECISIÓN</span>
        <h2>Menos tiempo cuadrando.<br />Más tiempo avanzando.</h2>
        <p>yasta convierte cada movimiento en una señal clara para que sepas dónde estás y qué hacer después.</p>
        <div className="intro-grid">
          <article><span>01</span><h3>Registra sin fricción</h3><p>Ventas, egresos y cobros con la información justa. Sin fórmulas ni plantillas.</p></article>
          <article><span>02</span><h3>Entiende al instante</h3><p>Utilidad, margen y meta se actualizan solos en un panel que habla claro.</p></article>
          <article><span>03</span><h3>Decide con confianza</h3><p>Detecta pendientes, compara periodos y descarga tus reportes cuando los necesites.</p></article>
        </div>
      </section>

      <section className="pricing-section" id="planes">
        <div className="shell">
          <span className="section-kicker">EMPIEZA SIN PAGAR</span>
          <h2>El plan correcto para cada etapa.</h2>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article key={plan.id} className={plan.id === "plan_esencial" ? "price-card price-card--featured" : "price-card"}>
                <span>{plan.id === "plan_esencial" ? "MÁS ELEGIDO" : plan.priceCents === 0 ? "PARA EMPEZAR" : "PARA CRECER"}</span>
                <h3>{plan.name}</h3>
                <div><strong>S/ {(plan.priceCents / 100).toFixed(0)}</strong><small>{plan.priceCents === 0 ? "para siempre" : "/ mes"}</small></div>
                <p>{plan.description}</p>
                <ul>{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul>
                <a className={plan.id === "plan_esencial" ? "button button--orange" : "button button--outline"} href="/crear-cuenta">{plan.priceCents === 0 ? "Empezar gratis" : "Probar yasta"}</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="privacy-section shell" id="privacidad">
        <div className="privacy-mark"><Logo compact inverted /><span /></div>
        <div><span className="section-kicker">PRIVACIDAD REAL</span><h2>Tus números son tuyos.<br />Punto.</h2></div>
        <p>Tu información financiera permanece separada por negocio y solo es visible para las personas autorizadas.</p>
      </section>

      <footer className="footer shell"><Logo /><p>Control simple para negocios que avanzan.</p><span>© 2026 yasta</span></footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}
