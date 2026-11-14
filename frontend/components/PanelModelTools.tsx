"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ToolDefinition = {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute(input: unknown): Promise<unknown>;
};

declare global {
  interface Document {
    readonly modelContext?: {
      registerTool(tool: ToolDefinition, options?: { signal?: AbortSignal }): void | Promise<void>;
    };
  }
}

export function PanelModelTools() {
  const router = useRouter();

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tool: ToolDefinition = {
      name: "create_financial_transaction",
      title: "Registrar movimiento financiero",
      description: "Registra un ingreso o egreso en el negocio abierto y actualiza el panel visible.",
      inputSchema: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["income", "expense"] },
          amountCents: { type: "integer", minimum: 1 },
          date: { type: "string", format: "date" },
          category: { type: "string", minLength: 2 },
          description: { type: "string", minLength: 2 },
          paymentMethod: { type: "string", minLength: 2 }
        },
        required: ["type", "amountCents", "date", "category", "description", "paymentMethod"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        const response = await fetch("/api/finance/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error?.message ?? "No se pudo registrar el movimiento.");
        router.refresh();
        return { id: payload.data.id, status: "created" };
      }
    };
    try {
      void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined);
    } catch {
      // WebMCP aún no está disponible en todos los navegadores.
    }
    return () => lifecycle.abort();
  }, [router]);

  return null;
}
