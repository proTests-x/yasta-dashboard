import { randomUUID } from "node:crypto";
import { z } from "zod";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amountCents: z.coerce.number().int().positive().max(1_000_000_000),
  date: z.iso.date(),
  category: z.string().trim().min(2).max(60),
  description: z.string().trim().min(2).max(160),
  paymentMethod: z.string().trim().min(2).max(40).default("Efectivo")
});

export function createTransaction(input, ownerId) {
  const data = transactionSchema.parse(input);
  return { id: randomUUID(), ownerId, ...data, createdAt: new Date().toISOString() };
}
