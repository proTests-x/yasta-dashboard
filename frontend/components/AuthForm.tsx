"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthFormProps = { mode: "login" | "register" };

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const response = await fetch(isRegister ? "/api/session/register" : "/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error?.message ?? "Revisa los datos e intenta nuevamente.");
      setPending(false);
      return;
    }
    router.push("/panel");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {isRegister && (
        <div className="auth-form__row">
          <label><span>Tu nombre</span><input name="fullName" autoComplete="name" placeholder="Usuario Demo" minLength={3} required /></label>
          <label><span>Negocio</span><input name="businessName" autoComplete="organization" placeholder="Café Horizonte" minLength={2} required /></label>
        </div>
      )}
      <label><span>Correo</span><input name="email" type="email" autoComplete="email" defaultValue={isRegister ? "" : "demo@example.invalid"} placeholder="tu@negocio.pe" required /></label>
      <label><span>Contraseña</span><input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} defaultValue={isRegister ? "" : "YastaDemo2026!"} minLength={isRegister ? 10 : 8} required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button--orange" disabled={pending}>{pending ? "Un momento…" : isRegister ? "Crear mi espacio" : "Entrar a mi panel"}<span>→</span></button>
      {!isRegister && <p className="demo-note"><strong>Demo lista:</strong> las credenciales ya están completadas.</p>}
    </form>
  );
}
