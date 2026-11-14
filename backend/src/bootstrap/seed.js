function isoDate(daysAgo) {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export const plans = [
  { id: "plan_gratis", name: "Gratis", priceCents: 0, description: "Ordena lo esencial sin pagar.", features: ["50 movimientos al mes", "5 cuentas por cobrar", "Panel y reporte mensual"], active: true },
  { id: "plan_esencial", name: "Esencial", priceCents: 4900, description: "Para negocios que ya están en movimiento.", features: ["Movimientos ilimitados", "Reportes PDF", "Historial completo"], active: true },
  { id: "plan_crece", name: "Crece", priceCents: 8900, description: "Más control para un negocio que escala.", features: ["Todo en Esencial", "Soporte prioritario", "Más usuarios próximamente"], active: true }
];

export function buildFinanceSeed(ownerId) {
  const row = (id, type, amountCents, daysAgo, category, description, paymentMethod = "Yape") => ({ id, ownerId, type, amountCents, date: isoDate(daysAgo), category, description, paymentMethod, createdAt: new Date().toISOString() });
  return {
    transactions: [
      row("tx_01", "income", 68000, 0, "Ventas", "Venta del día"),
      row("tx_02", "income", 145000, 1, "Servicios", "Pedido corporativo", "Transferencia"),
      row("tx_03", "expense", 12000, 1, "Insumos", "Compra de café", "Efectivo"),
      row("tx_04", "income", 98000, 2, "Ventas", "Ventas del mostrador"),
      row("tx_05", "expense", 26500, 3, "Operación", "Servicio de internet", "Débito"),
      row("tx_06", "income", 226400, 4, "Ventas", "Campaña de fin de semana", "Tarjeta"),
      row("tx_07", "expense", 48700, 5, "Insumos", "Abastecimiento semanal", "Transferencia"),
      row("tx_08", "income", 289000, 6, "Ventas", "Ventas semanales", "Mixto"),
      row("tx_09", "expense", 90800, 7, "Alquiler", "Alquiler del local", "Transferencia"),
      row("tx_10", "income", 149000, 8, "Ventas", "Ventas del día", "Mixto")
    ],
    receivables: [
      { id: "rec_01", ownerId, customerName: "Cliente Demo A", amountCents: 85000, balanceCents: 85000, dueDate: isoDate(3), note: "Pedido mayorista", createdAt: new Date().toISOString() },
      { id: "rec_02", ownerId, customerName: "Cliente Demo B", amountCents: 42000, balanceCents: 21000, dueDate: isoDate(-5), note: "Coffee break", createdAt: new Date().toISOString() }
    ]
  };
}
