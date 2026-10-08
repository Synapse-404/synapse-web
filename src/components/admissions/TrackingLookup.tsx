"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import AdmissionProgress from "@/components/admissions/AdmissionProgress";
import { INSTITUTION_DOMAIN } from "@/lib/admissions/validation";
import type { PublicAdmissionResult } from "@/lib/admissions/tracking-types";

type LookupResponse = { application?: PublicAdmissionResult; message?: string };

export default function TrackingLookup() {
  const [email, setEmail] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PublicAdmissionResult | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(""); setResult(null); setPending(true);
    try {
      const response = await fetch("/api/seguimiento/consultar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email, trackingCode }),
      });
      const data = await response.json() as LookupResponse;
      if (!response.ok || !data.application) {
        setError(data.message ?? "No se pudo consultar la solicitud.");
        return;
      }
      setTrackingCode(""); // El código privado no queda visible después de la consulta.
      setResult(data.application);
    } catch {
      setError("No podemos conectar con el servicio. Revisa tu conexión e intenta de nuevo.");
    } finally { setPending(false); }
  }

  return (
    <div className="portal-content">
      {!result ? <div className="portal-columns">
        <section className="portal-form-card" aria-labelledby="portal-form-title">
          <div className="portal-form-top"><span>01</span><span>ACCESO A TU SOLICITUD</span></div>
          <h2 id="portal-form-title">Consulta tu <span>postulación.</span></h2>
          <p>Ingresa el correo institucional con el que te registraste y el código privado que recibiste al finalizar el formulario.</p>
          <form onSubmit={submit} className="portal-form">
            <label htmlFor="portal-email">Correo institucional</label>
            <input id="portal-email" name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={`nombre@${INSTITUTION_DOMAIN}`} required maxLength={254} />
            <label htmlFor="portal-code">Código o enlace de seguimiento</label>
            <textarea id="portal-code" name="trackingCode" value={trackingCode} onChange={e => setTrackingCode(e.target.value)} placeholder="Pega aquí el código o el enlace privado que guardaste" required rows={2} maxLength={2048} autoCapitalize="off" autoComplete="off" spellCheck={false} />
            <p className="portal-field-help">Tu código es privado. Nunca lo compartas ni publiques capturas que lo incluyan.</p>
            {error && <div className="portal-error" role="alert">{error}</div>}
            <button className="portal-submit" type="submit" disabled={pending}>{pending ? "Consultando…" : "Consultar mi estado"}<span aria-hidden="true">↗</span></button>
          </form>
          <div className="portal-form-bottom">¿Todavía no te postulaste? <Link href="/#contacto">Realiza tu registro ↗</Link></div>
        </section>
        <aside className="portal-guide" aria-labelledby="portal-guide-title">
          <span className="portal-overline">EL PROCESO DE ADMISIÓN</span>
          <h3 id="portal-guide-title">Cada etapa tiene<br /><em>su momento.</em></h3>
          <div className="portal-guide-list">
            <div><span>01</span><div><strong>Solicitud recibida</strong><p>Registramos tu postulación institucional.</p></div></div>
            <div><span>02</span><div><strong>En revisión</strong><p>Coordinación evalúa tu información.</p></div></div>
            <div><span>03</span><div><strong>Decisión</strong><p>Podrás saber si fuiste admitido o no.</p></div></div>
          </div>
          <div className="portal-guide-footer"><span aria-hidden="true">✳</span><p>En SYNAPSE creemos que cada proceso de investigación comienza con una oportunidad de aprender.</p></div>
        </aside>
      </div> : <>
        <div className="portal-result-actions"><button type="button" onClick={() => { setResult(null); setEmail(""); setTrackingCode(""); }} className="portal-back">← Consultar otra solicitud</button><span>CONSULTA PRIVADA · SYNAPSE</span></div>
        <AdmissionProgress application={result} />
      </>}
      <div className="portal-faq">
        <span>INFORMACIÓN IMPORTANTE</span>
        <div><h3>¿Qué ocurre si no conservas tu código?</h3><p>Contacta a coordinación del semillero para solicitar orientación. Por seguridad, no se permite recuperar una solicitud únicamente con el correo electrónico.</p></div>
        <div><h3>¿El resultado aparece inmediatamente?</h3><p>No. Primero registramos tu solicitud, después la revisa el equipo y finalmente se comunica la decisión en este portal.</p></div>
      </div>
    </div>
  );
}
