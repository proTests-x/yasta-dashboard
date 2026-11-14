import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";
import { PanelModelTools } from "@/components/PanelModelTools";
import { TransactionForm } from "@/components/TransactionForm";
import { getProtectedData, type Overview, type SessionUser } from "@/lib/backend";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Panel financiero", robots: { index: false, follow: false } };

const money = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fullDate = new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long" });
const monthLabel = new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "2-digit", timeZone: "UTC" });

export default async function PanelPage() {
  const [user, overview] = await Promise.all([
    getProtectedData<SessionUser>("/api/v1/auth/me"),
    getProtectedData<Overview>("/api/v1/finance/overview")
  ]);
  if (!user || !overview) redirect("/ingresar");
  const maxFlow = Math.max(...overview.dailyFlow.flatMap((item) => [item.incomeCents, item.expenseCents]), 1);

  return (
    <main className="panel-shell">
      <PanelModelTools />
      <aside className="panel-sidebar">
        <Logo inverted />
        <div className="panel-business"><span>{user.businessName.slice(0, 1)}</span><div><small>MI NEGOCIO</small><strong>{user.businessName}</strong></div></div>
        <nav aria-label="Navegación del panel"><a className="active" href="/panel"><i>⌂</i> Resumen</a><a href="#movimientos"><i>⇅</i> Movimientos</a><a href="#cobros"><i>$</i> Por cobrar</a><a href="#reportes"><i>▤</i> Reportes</a></nav>
        <div className="panel-sidebar__bottom"><span>{user.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><strong>{user.fullName}</strong><small>{user.email}</small></div><LogoutButton /></div>
      </aside>

      <section className="panel-main">
        <header className="panel-topbar"><span>{monthLabel.format(new Date(`${overview.month}-02T12:00:00Z`)).toUpperCase()}</span><div><small>HOY</small><strong>{fullDate.format(new Date())}</strong></div></header>
        <div className="panel-content">
          <div className="panel-heading"><div><span className="section-kicker">RESUMEN DEL MES</span><h1>Todo claro, {user.fullName.split(" ")[0]}.</h1><p>Así se mueve tu negocio hasta hoy.</p></div><TransactionForm /></div>

          <div className="panel-kpis">
            <article><div><span>INGRESOS</span><i className="positive">↗</i></div><strong>{money.format(overview.incomeCents / 100)}</strong><small>{overview.transactionCount} movimientos registrados</small></article>
            <article><div><span>EGRESOS</span><i className="negative">↘</i></div><strong>{money.format(overview.expenseCents / 100)}</strong><small>Gastos del periodo</small></article>
            <article className="panel-kpis__focus"><div><span>UTILIDAD NETA</span><i>◇</i></div><strong>{money.format(overview.profitCents / 100)}</strong><small>{overview.marginPercent}% de margen</small></article>
            <article><div><span>POR COBRAR</span><i className="warning">$</i></div><strong>{money.format(overview.openReceivablesCents / 100)}</strong><small>{overview.openReceivablesCount} cuentas abiertas</small></article>
          </div>

          <div className="panel-grid">
            <article className="panel-card panel-chart-card">
              <div className="panel-card__heading"><div><span>FLUJO DEL NEGOCIO</span><h2>Ingresos y egresos</h2></div><div className="panel-legend"><span><i className="income" />Ingresos</span><span><i className="expense" />Egresos</span></div></div>
              <div className="panel-chart">
                {overview.dailyFlow.map((item) => <div key={item.day}><span><i className="income" style={{ height: `${Math.max(4, (item.incomeCents / maxFlow) * 100)}%` }} /><i className="expense" style={{ height: `${Math.max(4, (item.expenseCents / maxFlow) * 100)}%` }} /></span><small>{item.day}</small></div>)}
              </div>
            </article>
            <article className="panel-card panel-health-card">
              <div className="panel-card__heading"><div><span>PULSO DEL NEGOCIO</span><h2>Salud financiera</h2></div></div>
              <div className="panel-health-ring" style={{ "--health": `${Math.max(0, Math.min(100, overview.marginPercent))}%` } as React.CSSProperties}><strong>{Math.round(Math.max(0, overview.marginPercent))}</strong><small>/ 100</small></div>
              <p><i /> Tu negocio mantiene un margen saludable.</p>
            </article>
          </div>

          <div className="panel-grid panel-grid--lower" id="movimientos">
            <article className="panel-card recent-card">
              <div className="panel-card__heading"><div><span>ACTIVIDAD RECIENTE</span><h2>Últimos movimientos</h2></div><a href="#">Ver todos →</a></div>
              <div className="transaction-list">
                {overview.recentTransactions.map((item) => <div key={item.id}><span className={item.type}>{item.type === "income" ? "↗" : "↘"}</span><div><strong>{item.description}</strong><small>{item.category} · {item.paymentMethod}</small></div><time>{shortDate.format(new Date(`${item.date}T12:00:00Z`))}</time><b className={item.type}>{item.type === "income" ? "+" : "−"} {money.format(item.amountCents / 100)}</b></div>)}
              </div>
            </article>
            <article className="panel-card goal-card">
              <div className="panel-card__heading"><div><span>META MENSUAL</span><h2>Camino a tu objetivo</h2></div></div>
              <strong>{overview.goalProgressPercent}%</strong><div className="goal-track"><span style={{ width: `${overview.goalProgressPercent}%` }} /></div><p><b>{money.format(overview.incomeCents / 100)}</b> de {money.format(overview.goalCents / 100)}</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
