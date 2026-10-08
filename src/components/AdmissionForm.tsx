"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { EMAIL_HINT, INSTITUTION_DOMAIN } from "@/lib/admissions/validation";

export default function AdmissionForm() {
  const [pending, setPending] = useState(false);
  const [trackingPath, setTrackingPath] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [fieldError, setFieldError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const email = String(values.get("email") ?? "").trim().toLowerCase();
    if (!email.endsWith(`@${INSTITUTION_DOMAIN}`) || email.split("@").length !== 2) {
      setFieldError(`Solo puedes registrarte con un correo @${INSTITUTION_DOMAIN}.`);
      return;
    }
    setFieldError("");
    setPending(true);
    try {
      const res = await fetch("/api/admisiones", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: values.get("fullName"), email, program: values.get("program"), semester: Number(values.get("semester")), consent: values.get("consent") === "on", website: values.get("website") }),
      });
      const body: { message?: string; trackingPath?: string; trackingCode?: string } = await res.json();
      if (!res.ok || !body.trackingPath) {
        setFieldError(body.message ?? "No se pudo completar el registro.");
        return;
      }
      setTrackingPath(body.trackingPath);
      setTrackingCode(body.trackingCode ?? body.trackingPath.split("/").at(-1) ?? "");
      toast.success("Solicitud registrada", { description: "Guarda el enlace de seguimiento que aparece en el formulario." });
      form.reset();
    } catch {
      setFieldError("No fue posible conectar con el servidor. Intenta nuevamente.");
    } finally { setPending(false); }
  }

  if (trackingPath) return (
    <div className="admission-success" role="status">
      <span className="admission-success-icon" aria-hidden="true">✓</span>
      <h3>Solicitud recibida.</h3>
      <p>Tu postulación quedó registrada. Guarda el siguiente código privado: lo necesitarás junto a tu correo institucional para entrar al portal. No se enviará automáticamente por correo.</p>
      <div className="admission-tracking-code"><span>CÓDIGO DE SEGUIMIENTO</span><code>{trackingCode}</code><button type="button" className="admission-copy" onClick={async () => { try { await navigator.clipboard.writeText(trackingCode); toast.success("Código copiado"); } catch { toast.error("Selecciona el código para copiarlo."); } }}>Copiar código ↗</button></div>
      <Link className="pill-btn pill-btn-light" href={trackingPath}>Ver estado de mi solicitud <span aria-hidden="true">↗</span></Link>
      <Link href="/seguimiento" className="admission-copy">Ir al portal de seguimiento ↗</Link>
      <button type="button" className="admission-copy" onClick={async () => { try { await navigator.clipboard.writeText(`${window.location.origin}${trackingPath}`); toast.success("Enlace copiado"); } catch { toast.error("Copia el enlace desde la página de seguimiento."); } }}>Copiar enlace de seguimiento ↗</button>
    </div>
  );

  return (
    <form onSubmit={submit} className="contact-form">
      <label htmlFor="fullName">Nombre completo</label>
      <input required name="fullName" id="fullName" type="text" autoComplete="name" minLength={5} maxLength={120} placeholder="Tu nombre completo" />
      <label htmlFor="email">Correo institucional Uniclaretiana</label>
      <input required name="email" id="email" type="email" autoComplete="email" maxLength={254} placeholder={EMAIL_HINT} aria-describedby="email-domain-help" />
      <small id="email-domain-help" className="admission-form-hint">Solo se admiten direcciones @{INSTITUTION_DOMAIN}</small>
      <div className="contact-form-half">
        <div><label htmlFor="program">Programa académico</label><input required name="program" id="program" type="text" minLength={3} maxLength={120} placeholder="Tu carrera" /></div>
        <div><label htmlFor="semester">Semestre actual</label><input required name="semester" id="semester" type="number" min="1" max="10" step="1" placeholder="01" /></div>
      </div>
      <div className="admission-honeypot" aria-hidden="true"><label htmlFor="website">Sitio web</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <label className="admission-consent"><input type="checkbox" name="consent" required /> <span>Autorizo que SYNAPSE trate estos datos exclusivamente para evaluar y gestionar mi solicitud de vinculación.</span></label>
      {fieldError && <p className="admission-error" role="alert">{fieldError}</p>}
      <button type="submit" disabled={pending} className="pill-btn pill-btn-light contact-submit">{pending ? "Enviando solicitud…" : "Enviar solicitud"}<span aria-hidden="true">↗</span></button>
      <small>Tu solicitud quedará en estado <strong>Recibida</strong>. La admisión no es automática; el semillero revisará cada postulación. <Link href="/seguimiento" className="admission-tracking-help">¿Ya te registraste? Consulta tu estado ↗</Link></small>
    </form>
  );
}
