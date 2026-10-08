"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();setLoading(true);setError("");
    const data = new FormData(event.currentTarget);
    try {
      const result = await fetch("/api/admin/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
      const payload: { message?: string } = await result.json();
      if (!result.ok) { setError(payload.message ?? "No se pudo iniciar sesión."); return; }
      router.replace("/admin");router.refresh();
    } catch { setError("No fue posible conectar con el servidor."); }
    finally { setLoading(false); }
  }
  return <form onSubmit={login} className="adm-login-form">
    <label htmlFor="adm-email">Correo de administrador</label><input id="adm-email" name="email" type="email" autoComplete="username" required placeholder="coordinacion@miuniclaretiana.edu.co" />
    <label htmlFor="adm-password">Contraseña</label><input id="adm-password" name="password" type="password" autoComplete="current-password" minLength={12} required placeholder="••••••••••••" />
    {error && <p role="alert" className="adm-error">{error}</p>}
    <button type="submit" className="adm-primary" disabled={loading}>{loading ? "Validando acceso…" : "Entrar al panel"}<span aria-hidden="true">↗</span></button>
  </form>;
}
