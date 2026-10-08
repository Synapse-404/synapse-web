"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import AdmissionProgress from "@/components/admissions/AdmissionProgress";
import { INSTITUTION_DOMAIN } from "@/lib/admissions/validation";
import type { PublicAdmissionResult } from "@/lib/admissions/tracking-types";

type LookupResponse = { application?: PublicAdmissionResult; message?: string };

const process = [
  { number: "01", title: "Registro", detail: "Recibimos tu solicitud y registramos la postulación." },
  { number: "02", title: "Revisión", detail: "Coordinación evalúa la información enviada." },
  { number: "03", title: "Decisión", detail: "Consulta si tu postulación fue aprobada." },
];

export default function TrackingLookup() {
  const [email, setEmail] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PublicAdmissionResult | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    setResult(null);
    setPending(true);
    try {
      const response = await fetch("/api/seguimiento/consultar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email, trackingCode }),
      });
      const data = (await response.json()) as LookupResponse;
      if (!response.ok || !data.application) {
        setError(data.message ?? "No se pudo consultar tu solicitud.");
        return;
      }
      setTrackingCode("");
      setResult(data.application);
    } catch {
      setError("No podemos conectar con el servicio. Comprueba tu conexión e intenta de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="portal-content portal-v2-body" id="consultar-estado" aria-label="Consulta de admisión">
      {!result ? (
        <div className="portal-columns portal-v2-columns">
          <section className="portal-form-card portal-v2-form-panel" aria-labelledby="portal-form-title">
            <div className="portal-form-top"><span>01 / CONSULTA PRIVADA</span><span>ACCESO SEGURO <span aria-hidden="true">↗</span></span></div>
            <div className="portal-v2-form-heading"><span className="portal-overline">CONSULTA TU POSTULACIÓN</span><h2 id="portal-form-title">¿Cómo va<br/><em>tu solicitud?</em></h2><p>Utiliza el correo institucional con el que te registraste y tu código privado. Solo tú debes conservar ese acceso.</p></div>
            <form onSubmit={submit} className="portal-form portal-v2-form">
              <label htmlFor="portal-email">Correo institucional</label>
              <input id="portal-email" name="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={`nombre@${INSTITUTION_DOMAIN}`} required maxLength={254} />
              <label htmlFor="portal-code">Código o enlace privado</label>
              <textarea id="portal-code" name="trackingCode" value={trackingCode} onChange={e => setTrackingCode(e.target.value)} placeholder="Pega el código que recibiste al registrarte" required rows={2} maxLength={2048} autoCapitalize="off" autoComplete="off" spellCheck={false} />
              <p className="portal-field-help"><span aria-hidden="true">◇</span> No compartas tu código: permite consultar información personal.</p>
              {error && <div className="portal-error" role="alert">{error}</div>}
              <button className="portal-submit" type="submit" disabled={pending} aria-busy={pending}>{pending ? "Consultando estado…" : "Ver estado de mi admisión"}<span aria-hidden="true">↗</span></button>
            </form>
            <div className="portal-form-bottom">¿Aún no te has registrado? <Link href="/#contacto">Únete al semillero ↗</Link></div>
          </section>
          <aside className="portal-guide portal-v2-guide" aria-labelledby="portal-guide-title">
            <div className="portal-v2-guide-glow" aria-hidden="true"/>
            <div className="portal-v2-guide-top"><span>EL CAMINO A SYNAPSE</span><span>03 ETAPAS</span></div>
            <h3 id="portal-guide-title">Cada idea<br/>tiene un<br/><em>comienzo.</em></h3>
            <div className="portal-guide-list">
              {process.map(item => <div key={item.number}><span>{item.number}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div><span className="portal-v2-guide-arrow" aria-hidden="true">↗</span></div>)}
            </div>
            <div className="portal-guide-footer"><span aria-hidden="true">✳</span><p>Investigación, colaboración y tecnología para transformar nuestro territorio.</p></div>
          </aside>
        </div>
      ) : (
        <>
          <div className="portal-result-actions"><button type="button" onClick={() => { setResult(null); setEmail(""); setTrackingCode(""); }} className="portal-back">← Nueva consulta</button><span>RESULTADO PRIVADO · SYNAPSE</span></div>
          <AdmissionProgress application={result} />
        </>
      )}
      <div className="portal-faq portal-v2-faq">
        <span>INFORMACIÓN ÚTIL / 002</span>
        <div><h3>¿Perdiste tu código?</h3><p>Contacta a coordinación del semillero. Por seguridad, el correo electrónico por sí solo no permite recuperar una postulación.</p></div>
        <div><h3>¿Cuándo aparece el resultado?</h3><p>El estado cambia cuando el equipo de coordinación registra una decisión. Puedes volver a consultar en cualquier momento.</p></div>
      </div>
    </section>
  );
}
