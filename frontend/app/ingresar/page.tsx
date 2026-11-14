import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Ingresar", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-page__signal" aria-hidden="true" />
      <header><Logo inverted /><a href="/">Volver al inicio</a></header>
      <section className="auth-card">
        <span className="section-kicker">TU NEGOCIO, EN UNA VISTA</span>
        <h1>Qué bueno verte.</h1>
        <p>Ingresa para revisar cómo se movieron tus números.</p>
        <AuthForm mode="login" />
        <small>¿Aún no tienes cuenta? <a href="/crear-cuenta">Empieza gratis</a></small>
      </section>
    </main>
  );
}
