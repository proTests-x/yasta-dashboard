export type Plan = {
  id: string;
  name: string;
  priceCents: number;
  description: string;
  features: string[];
};

const fallbackPlans: Plan[] = [
  {
    id: "plan_gratis",
    name: "Gratis",
    priceCents: 0,
    description: "Ordena lo esencial sin pagar.",
    features: ["50 movimientos al mes", "5 cuentas por cobrar", "Panel y reporte mensual"]
  },
  {
    id: "plan_esencial",
    name: "Esencial",
    priceCents: 4900,
    description: "Para negocios que ya están en movimiento.",
    features: ["Movimientos ilimitados", "Reportes PDF", "Historial completo"]
  },
  {
    id: "plan_crece",
    name: "Crece",
    priceCents: 8900,
    description: "Más control para un negocio que escala.",
    features: ["Todo en Esencial", "Soporte prioritario", "Más usuarios próximamente"]
  }
];

export async function getPlans(): Promise<Plan[]> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL ?? "http://127.0.0.1:4000"}/api/v1/plans`, {
      next: { revalidate: 300 }
    });
    if (!response.ok) return fallbackPlans;
    const payload = (await response.json()) as { data?: Plan[] };
    return payload.data?.length ? payload.data : fallbackPlans;
  } catch {
    return fallbackPlans;
  }
}
