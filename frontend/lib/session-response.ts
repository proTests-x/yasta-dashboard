import { NextResponse } from "next/server";

type AuthPayload = {
  data?: { token: string; user: unknown };
  error?: { message?: string };
};

export function createSessionResponse(payload: AuthPayload, status: number) {
  const response = NextResponse.json(payload.data ? { data: { user: payload.data.user } } : payload, { status });
  if (payload.data?.token) {
    response.cookies.set("yasta_session", payload.data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
      priority: "high"
    });
  }
  return response;
}
