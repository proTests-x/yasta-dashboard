import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/backend";

export async function POST(request: Request) {
  const token = (await cookies()).get("yasta_session")?.value;
  if (!token) return NextResponse.json({ error: { message: "Necesitas iniciar sesión." } }, { status: 401 });
  try {
    const response = await fetch(apiUrl("/api/v1/finance/transactions"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(await request.json()),
      cache: "no-store"
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ error: { message: "No pudimos guardar el movimiento." } }, { status: 503 });
  }
}
