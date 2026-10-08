import type { AdmissionStatus } from "@/generated/prisma/client";
import { statusDescriptions, statusLabels } from "@/lib/admissions/status";
import type { PublicAdmissionResult } from "@/lib/admissions/tracking-types";

const formatDate = (value: string, time = false) => new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota", dateStyle: "long", ...(time ? { timeStyle: "short" as const } : {}),
}).format(new Date(value));

const steps: Array<{ label: string; description: string }> = [
  { label: "Solicitud recibida", description: "Tus datos fueron registrados" },
  { label: "Revisión académica", description: "Evaluación del equipo del semillero" },
  { label: "Decisión final", description: "Resultado del proceso de vinculación" },
];

const currentStep: Record<AdmissionStatus, number> = {
  PENDING: 0, IN_REVIEW: 1, APPROVED: 2, REJECTED: 2,
};

export default function AdmissionProgress({ application }: { application: PublicAdmissionResult }) {
  const final = application.status === "APPROVED" || application.status === "REJECTED";
  const outcomeClass = application.status === "APPROVED" ? "portal-approved" : application.status === "REJECTED" ? "portal-rejected" : "portal-pending";
  return (
    <section className="portal-result" aria-label="Resultado de admisión">
      <div className="portal-result-head">
        <div>
          <span className="portal-overline">ESTADO DE TU POSTULACIÓN</span>
          <h2>Hola, {application.fullName.split(" ")[0]}<span className="portal-accent">.</span></h2>
          <p>Este es el estado de tu proceso de vinculación a SYNAPSE.</p>
        </div>
        <span className={`portal-status ${outcomeClass}`} role="status">
          <span className="portal-status-dot" aria-hidden="true" />{statusLabels[application.status]}
        </span>
      </div>
      <div className={`portal-outcome ${outcomeClass}`}>
        <div className="portal-outcome-icon" aria-hidden="true">{application.status === "APPROVED" ? "✓" : application.status === "REJECTED" ? "—" : "◷"}</div>
        <div>
          <span>RESULTADO ACTUAL</span>
          <h3>{application.status === "APPROVED" ? "Has sido admitido al semillero." : application.status === "REJECTED" ? "No fuiste admitido en esta convocatoria." : application.status === "IN_REVIEW" ? "Tu solicitud está en evaluación." : "Hemos recibido tu solicitud."}</h3>
          <p>{statusDescriptions[application.status]}</p>
        </div>
      </div>
      <div className="portal-result-grid">
        <div className="portal-detail"><span>PROGRAMA ACADÉMICO</span><strong>{application.program}</strong></div>
        <div className="portal-detail"><span>SEMESTRE</span><strong>{application.semester}</strong></div>
        <div className="portal-detail"><span>FECHA DE REGISTRO</span><strong>{formatDate(application.submittedAt)}</strong></div>
        <div className="portal-detail"><span>ÚLTIMO MOVIMIENTO</span><strong>{formatDate(application.history.at(-1)?.at ?? application.updatedAt)}</strong></div>
      </div>
      <div className="portal-section-heading"><span>01 / ETAPAS</span><h3>Tu proceso, paso a paso.</h3></div>
      <ol className="portal-steps">
        {steps.map((step, index) => {
          const completed = index < currentStep[application.status] || (index === 2 && final);
          const active = index === currentStep[application.status] && !final;
          return <li key={step.label} className={`${completed ? "is-complete" : ""} ${active ? "is-current" : ""}`}>
            <div className="portal-step-num">{completed ? "✓" : String(index + 1).padStart(2, "0")}</div>
            <div><strong>{step.label}</strong><span>{index === 2 && final ? statusLabels[application.status] : step.description}</span></div>
          </li>;
        })}
      </ol>
      <div className="portal-section-heading"><span>02 / ACTIVIDAD</span><h3>Historial de la solicitud.</h3></div>
      <ol className="portal-events">
        {application.history.map((event, index) => <li key={`${event.at}-${index}`}>
          <span className="portal-event-marker" aria-hidden="true" />
          <div><strong>{statusLabels[event.status]}</strong><time dateTime={event.at}>{formatDate(event.at, true)}</time></div>
        </li>)}
      </ol>
      <div className="portal-result-note">El estado se actualiza cuando coordinación registra una decisión. La información mostrada corresponde exclusivamente a tu postulación.</div>
    </section>
  );
}
