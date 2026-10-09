"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const result = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });
      const payload: { message?: string } = await result.json();
      if (!result.ok) {
        setError(payload.message ?? "No se pudo iniciar sesión.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("No pudimos conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={login} className="auth-v2-form">
      <div className="auth-v2-field">
        <label htmlFor="adm-email">Correo de administrador</label>
        <input id="adm-email" name="email" type="email" autoComplete="username" required maxLength={254} placeholder="coordinacion@uniclaretiana.edu.co" />
      </div>
      <div className="auth-v2-field">
        <label htmlFor="adm-password">Contraseña</label>
        <div className="auth-v2-password">
          <input id="adm-password" name="password" type={visible ? "text" : "password"} autoComplete="current-password" minLength={12} required placeholder="Introduce tu contraseña" />
          <button type="button" onClick={() => setVisible(v => !v)} aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={visible}>{visible ? "Ocultar" : "Mostrar"}</button>
        </div>
      </div>
      {error && <div className="auth-v2-error" role="alert">{error}</div>}
      <button type="submit" className="auth-v2-submit" disabled={loading}>
        <span>{loading ? "Verificando credenciales…" : "Entrar al workspace"}</span>
        <span className="auth-v2-submit-icon" aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
