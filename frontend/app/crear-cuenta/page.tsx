import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Crear cuenta gratis", robots: { index: true, follow: true } };

export default function RegisterPage() {
  return (
    <main className="auth-page auth-page--register">
      <div className="auth-page__signal" aria-hidden="true" />
      <header><Logo inverted /><a href="/">Volver al inicio</a></header>
      <section className="auth-card">
        <span className="section-kicker">50 MOVIMIENTOS GRATIS CADA MES</span>
        <h1>Empieza claro.</h1>
        <p>Crea tu espacio y registra tu primer movimiento en minutos.</p>
        <AuthForm mode="register" />
        <small>¿Ya tienes cuenta? <a href="/ingresar">Ingresa aquí</a></small>
      </section>
    </main>
  );
}
