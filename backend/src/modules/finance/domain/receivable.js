import { randomUUID } from "node:crypto";
import { z } from "zod";

const receivableSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  amountCents: z.coerce.number().int().positive().max(1_000_000_000),
  balanceCents: z.coerce.number().int().nonnegative().max(1_000_000_000).optional(),
  dueDate: z.iso.date(),
  note: z.string().trim().max(160).default("")
});

export function createReceivable(input, ownerId) {
  const data = receivableSchema.parse(input);
  return {
    id: randomUUID(),
    ownerId,
    ...data,
    balanceCents: data.balanceCents ?? data.amountCents,
    createdAt: new Date().toISOString()
  };
}
