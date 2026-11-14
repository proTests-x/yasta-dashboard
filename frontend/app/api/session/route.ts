import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/backend";
import { createSessionResponse } from "@/lib/session-response";

export async function POST(request: Request) {
  try {
    const response = await fetch(apiUrl("/api/v1/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await request.json()),
      cache: "no-store"
    });
    return createSessionResponse(await response.json(), response.status);
  } catch {
    return NextResponse.json({ error: { message: "No pudimos conectar con el servicio. Intenta nuevamente." } }, { status: 503 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ data: { signedOut: true } });
  response.cookies.set("yasta_session", "", { httpOnly: true, expires: new Date(0), path: "/" });
  return response;
}
