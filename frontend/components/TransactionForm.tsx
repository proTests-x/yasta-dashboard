"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TransactionForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    const response = await fetch("/api/finance/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: form.get("type"),
        amountCents: Math.round(Number(form.get("amount")) * 100),
        date: form.get("date"),
        category: form.get("category"),
        description: form.get("description"),
        paymentMethod: form.get("paymentMethod")
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error?.message ?? "No pudimos guardar el movimiento.");
      setPending(false);
      return;
    }
    setPending(false);
    setOpen(false);
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <>
      <button className="button button--orange panel-primary" onClick={() => setOpen(true)}>+ Nuevo movimiento</button>
      {open && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section className="transaction-dialog" role="dialog" aria-modal="true" aria-labelledby="transaction-title">
            <div className="transaction-dialog__header"><div><span>NUEVO REGISTRO</span><h2 id="transaction-title">Anota un movimiento</h2></div><button aria-label="Cerrar" onClick={() => setOpen(false)}>×</button></div>
            <form className="transaction-form" onSubmit={handleSubmit}>
              <div className="transaction-form__type"><label><input type="radio" name="type" value="income" defaultChecked /><span>↗ Ingreso</span></label><label><input type="radio" name="type" value="expense" /><span>↘ Egreso</span></label></div>
              <label><span>Monto en soles</span><div className="money-field"><b>S/</b><input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required /></div></label>
              <div className="auth-form__row"><label><span>Fecha</span><input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></label><label><span>Categoría</span><input name="category" placeholder="Ventas" required /></label></div>
              <label><span>Descripción</span><input name="description" placeholder="Venta del día" required /></label>
              <label><span>Medio de pago</span><select name="paymentMethod" defaultValue="Yape"><option>Yape</option><option>Efectivo</option><option>Transferencia</option><option>Tarjeta</option></select></label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="transaction-form__actions"><button type="button" className="button button--outline" onClick={() => setOpen(false)}>Cancelar</button><button className="button button--orange" disabled={pending}>{pending ? "Guardando…" : "Guardar movimiento"}</button></div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
