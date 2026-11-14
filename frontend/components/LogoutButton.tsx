"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return <button className="panel-logout" disabled={pending} onClick={async () => { setPending(true); await fetch("/api/session", { method: "DELETE" }); router.push("/"); router.refresh(); }}>{pending ? "Saliendo…" : "Cerrar sesión"}</button>;
}
