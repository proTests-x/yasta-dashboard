import "server-only";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:4000";

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  businessName: string;
  role: string;
  monthlyGoalCents: number;
  planId: string;
};

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amountCents: number;
  date: string;
  category: string;
  description: string;
  paymentMethod: string;
};

export type Overview = {
  month: string;
  incomeCents: number;
  expenseCents: number;
  profitCents: number;
  marginPercent: number;
  goalCents: number;
  goalProgressPercent: number;
  openReceivablesCount: number;
  openReceivablesCents: number;
  overdueCents: number;
  transactionCount: number;
  recentTransactions: Transaction[];
  dailyFlow: Array<{ day: string; incomeCents: number; expenseCents: number }>;
};

export async function getProtectedData<T>(path: string): Promise<T | null> {
  const token = (await cookies()).get("yasta_session")?.value;
  if (!token) return null;
  try {
    const response = await fetch(`${backendUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { data: T };
    return payload.data;
  } catch {
    return null;
  }
}

export function apiUrl(path: string) {
  return `${backendUrl}${path}`;
}
