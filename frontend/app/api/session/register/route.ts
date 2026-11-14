import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/backend";
import { createSessionResponse } from "@/lib/session-response";

export async function POST(request: Request) {
  try {
    const response = await fetch(apiUrl("/api/v1/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await request.json()),
      cache: "no-store"
    });
    return createSessionResponse(await response.json(), response.status);
  } catch {
    return NextResponse.json({ error: { message: "No pudimos crear la cuenta en este momento." } }, { status: 503 });
  }
}
