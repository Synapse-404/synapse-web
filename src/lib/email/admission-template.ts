/** Plantilla de correo compatible con clientes de correo (tablas + estilos inline).
 * No debe importar librerías exclusivas del servidor para permitir pruebas y previsualizaciones.
 */
export type NotificationStatus = "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export const PUBLIC_SITE_URL = "https://www.semillerosynapse.com";

export type AdmissionEmailData = {
  fullName: string;
  program: string;
  status: NotificationStatus;
  trackingUrl: string;
};

type StatusContent = {
  subject: string;
  chip: string;        // etiqueta corta del estado
  finalLabel: string;  // nombre de la 3.ª etapa del recorrido
  title: string;
  message: string;
  detail: string;
  action: string;
  color: string;       // color del estado sobre fondo claro
  background: string;  // fondo suave del estado sobre fondo claro
  accent: string;      // color del estado sobre fondo oscuro (hero)
};

const content: Record<NotificationStatus, StatusContent> = {
  PENDING: {
    subject: "Recibimos tu postulación | SYNAPSE",
    chip: "Postulación recibida",
    finalLabel: "Decisión",
    title: "Tu próximo capítulo empieza aquí.",
    message: "Recibimos correctamente tu solicitud para formar parte del Semillero de Investigación SYNAPSE.",
    detail: "Nuestro equipo revisará tu información académica. Este correo confirma la recepción de tu solicitud, no tu admisión.",
    action: "Consultar mi postulación",
    color: "#9A6200", background: "#FFF1CF", accent: "#F5A50F",
  },
  IN_REVIEW: {
    subject: "Estamos revisando tu postulación | SYNAPSE",
    chip: "En revisión",
    finalLabel: "Decisión",
    title: "Tu solicitud está avanzando.",
    message: "Tu postulación pasó a la etapa de revisión por parte del equipo de coordinación de SYNAPSE.",
    detail: "Por ahora no necesitas realizar ninguna acción. Cuando se tome una decisión, te avisaremos a este mismo correo.",
    action: "Ver el estado del proceso",
    color: "#07616B", background: "#DDF5F7", accent: "#36C6D3",
  },
  APPROVED: {
    subject: "¡Tu postulación fue aprobada! | SYNAPSE",
    chip: "Postulación aprobada",
    finalLabel: "Aprobada",
    title: "¡Bienvenido a SYNAPSE!",
    message: "Tu solicitud de vinculación al Semillero de Investigación SYNAPSE fue aprobada.",
    detail: "¡Nos alegra que quieras investigar y construir tecnología con impacto! El equipo de coordinación te comunicará los siguientes pasos para tu vinculación.",
    action: "Consultar mi aprobación",
    color: "#13633E", background: "#DFF6E8", accent: "#3DD68C",
  },
  REJECTED: {
    subject: "Actualización de tu postulación | SYNAPSE",
    chip: "Resultado de la convocatoria",
    finalLabel: "Resultado",
    title: "Gracias por tu interés en investigar.",
    message: "Luego de revisar tu solicitud, en esta convocatoria no fue posible aprobar tu vinculación al semillero.",
    detail: "Valoramos tu iniciativa y te animamos a seguir desarrollando tus ideas. Puedes contactar a la coordinación del semillero si deseas orientación sobre futuras oportunidades.",
    action: "Consultar el resultado",
    color: "#8C2F4B", background: "#FCE9EF", accent: "#EE8FA6",
  },
};

/* ---------- Sistema visual: lenguaje del sitio semillerosynapse.com ----------
 * Fondo oscuro inmersivo, titular con la última palabra en cursiva, secciones numeradas
 * "01 / …", marcador SYN / 001, flechas ↗ y lema en mayúsculas. Colores tomados del logo. */
const INK = "#101821";
const PANEL = "#16212D";
const LINE = "#2A3948";
const PAPER = "#F4F4F2";
const AMBER = "#F5A50F";
const SOFT = "#B8C3CE";
const MUTED = "#7F8FA0";
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',Times,serif";

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const rgba = (hex: string, alpha: number) => `rgba(${rgb(hex).join(",")},${alpha})`;

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const EMPTY = `font-size:0;line-height:0;mso-line-height-rule:exactly;`;
const TRACK = (px: number) => `letter-spacing:${px}px;`;

export function renderAdmissionEmail(data: AdmissionEmailData): { subject: string; html: string; text: string } {
  const c = content[data.status];
  const name = data.fullName.trim().split(/\s+/)[0] || "Estudiante";
  const safeName = escapeHtml(name);
  const safeProgram = escapeHtml(data.program);
  const url = new URL(data.trackingUrl);
  if (url.origin !== PUBLIC_SITE_URL || !(url.pathname === "/seguimiento" || url.pathname.startsWith("/seguimiento/"))) {
    throw new Error("La URL de seguimiento no pertenece al dominio público autorizado.");
  }
  const href = escapeHtml(url.toString());

  /* Titular: la última palabra va en cursiva con el color del estado, como en el sitio. */
  const words = c.title.split(" ");
  const emph = words.pop() as string;
  const lead = words.join(" ");

  /* Recorrido: tres barras numeradas (es una secuencia real). */
  const stage = data.status === "PENDING" ? 0 : data.status === "IN_REVIEW" ? 1 : 2;
  const phases = ["Recibida", "En revisión", c.finalLabel];
  const steps = phases
    .map((label, i) => {
      const bar = i === stage ? c.accent : i < stage ? PAPER : LINE;
      const fg = i === stage ? "#FFFFFF" : i < stage ? SOFT : MUTED;
      const gap = i < 2 ? "padding:0 6px 0 0;" : "";
      return `<td width="33%" valign="top" style="${gap}"><table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%"><tr><td height="4" bgcolor="${bar}" style="height:4px;background:${bar};border-radius:2px;${EMPTY}">&nbsp;</td></tr><tr><td style="padding:12px 0 0;font-family:${SANS};font-size:11px;line-height:16px;font-weight:${i === stage ? 700 : 500};${TRACK(1)}color:${fg};"><span style="color:${i === stage ? c.accent : fg};">0${i + 1}</span>&nbsp;&nbsp;${escapeHtml(label.toUpperCase())}</td></tr></table></td>`;
    })
    .join("");

  const kicker = `0${stage + 1} / ${c.chip.toUpperCase()}`;
  const glow = `background-color:${INK};background-image:radial-gradient(ellipse 75% 65% at 100% 0%,${rgba(c.accent, 0.26)} 0%,${rgba(c.accent, 0)} 70%);`;
  const note =
    data.status === "PENDING"
      ? "Tu enlace es personal: consérvalo y no lo compartas con terceros."
      : "Para ingresar al portal también puedes utilizar tu correo institucional y el código privado recibido al registrarte.";
  const navLink = (label: string, path: string) =>
    `<a href="${PUBLIC_SITE_URL}${path}" target="_blank" style="color:${SOFT};text-decoration:none;">${label}</a>`;

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${escapeHtml(c.subject)}</title>
<style>
@media only screen and (max-width:640px){
.outer{padding:0!important}
.px{padding-left:26px!important;padding-right:26px!important}
.title{font-size:38px!important;line-height:42px!important}
.brand-img{width:170px!important;height:auto!important}
.stack{display:block!important;width:100%!important;box-sizing:border-box;border-right:0!important}
.stack-top{border-top:1px solid ${LINE}!important}
.cta-table{width:100%!important}
.cta-link{display:block!important;text-align:center!important}
}
a{color:inherit}
</style></head>
<body style="margin:0;padding:0;background:#0A0F15;font-family:${SANS};color:#FFFFFF;-webkit-text-size-adjust:100%;">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(c.message)} Consulta los detalles de tu postulación a SYNAPSE.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" bgcolor="#0A0F15" style="background:#0A0F15;"><tr><td class="outer" align="center" style="padding:36px 16px 48px;">
<table role="presentation" border="0" cellspacing="0" cellpadding="0" width="640" style="width:100%;max-width:640px;">

<!-- Barra de marca -->
<tr><td class="px" bgcolor="${INK}" style="background:${INK};border-bottom:1px solid ${LINE};padding:24px 44px;">
  <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%"><tr>
    <td align="left" valign="middle"><a href="${PUBLIC_SITE_URL}" target="_blank" style="text-decoration:none;color:#FFFFFF;"><img class="brand-img" src="${PUBLIC_SITE_URL}/synapse-header-logo.png" width="190" alt="SYNAPSE · Semillero de Investigación" border="0" style="display:block;width:190px;max-width:100%;height:auto;color:#FFFFFF;font-family:${SANS};font-size:22px;font-weight:bold;"></a></td>
    <td align="right" valign="middle" style="font-family:${SANS};font-size:11px;line-height:16px;font-weight:700;${TRACK(1.6)}color:${AMBER};white-space:nowrap;">SYN / 001</td>
  </tr></table>
</td></tr>

<!-- Hero -->
<tr><td class="px" bgcolor="${INK}" style="${glow}padding:52px 44px 44px;">
  <p style="margin:0 0 26px;font-family:${SANS};font-size:11px;line-height:16px;font-weight:700;${TRACK(1.8)}color:${c.accent};">${escapeHtml(kicker)}</p>
  <h1 class="title" style="margin:0 0 24px;font-family:${SANS};font-size:50px;line-height:52px;letter-spacing:-2px;font-weight:800;color:#FFFFFF;">${escapeHtml(lead)} <span style="font-family:${SERIF};font-style:italic;font-weight:400;letter-spacing:-1px;color:${c.accent};">${escapeHtml(emph)}</span></h1>
  <p style="margin:0 0 6px;font-family:${SANS};font-size:15px;line-height:24px;color:${MUTED};">Hola, <strong style="color:#FFFFFF;">${safeName}</strong></p>
  <p style="margin:0 0 18px;font-family:${SANS};font-size:17px;line-height:28px;color:#E3E9EE;">${escapeHtml(c.message)}</p>
  <p style="margin:0;font-family:${SANS};font-size:15px;line-height:26px;color:${SOFT};">${escapeHtml(c.detail)}</p>
</td></tr>

<!-- Recorrido -->
<tr><td class="px" bgcolor="${INK}" style="background:${INK};padding:0 44px 40px;">
  <p style="margin:0 0 16px;font-family:${SANS};font-size:10px;line-height:14px;font-weight:700;${TRACK(1.8)}color:${MUTED};">TU RECORRIDO EN SYNAPSE</p>
  <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%"><tr>${steps}</tr></table>
</td></tr>

<!-- Datos -->
<tr><td class="px" bgcolor="${INK}" style="background:${INK};padding:0 44px 36px;">
  <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" bgcolor="${PANEL}" style="background:${PANEL};border:1px solid ${LINE};border-radius:12px;"><tr>
    <td class="stack" width="55%" valign="top" style="padding:20px 24px;border-right:1px solid ${LINE};"><p style="margin:0 0 7px;font-family:${SANS};font-size:10px;line-height:14px;font-weight:700;${TRACK(1.6)}color:${MUTED};">PROGRAMA ACADÉMICO</p><p style="margin:0;font-family:${SANS};font-size:16px;line-height:23px;font-weight:700;color:#FFFFFF;">${safeProgram}</p></td>
    <td class="stack stack-top" valign="top" style="padding:20px 24px;"><p style="margin:0 0 7px;font-family:${SANS};font-size:10px;line-height:14px;font-weight:700;${TRACK(1.6)}color:${MUTED};">ESTADO</p><p style="margin:0;font-family:${SANS};font-size:16px;line-height:23px;font-weight:700;color:${c.accent};">${escapeHtml(c.chip)}</p></td>
  </tr></table>
</td></tr>

<!-- Acción -->
<tr><td class="px" bgcolor="${INK}" style="background:${INK};padding:0 44px 14px;">
  <table class="cta-table" role="presentation" border="0" cellspacing="0" cellpadding="0"><tr><td bgcolor="${AMBER}" style="border-radius:8px;background:${AMBER};"><a class="cta-link" href="${href}" target="_blank" style="display:inline-block;padding:18px 32px;border-radius:8px;font-family:${SANS};font-size:15px;line-height:20px;font-weight:800;text-decoration:none;color:${INK};">${escapeHtml(c.action)}&nbsp;&nbsp;&#8599;</a></td></tr></table>
  <p style="margin:22px 0 0;font-family:${SANS};font-size:12px;line-height:19px;color:${MUTED};">Si el botón no funciona, copia este enlace en tu navegador:<br><a href="${href}" target="_blank" style="color:${SOFT};word-break:break-all;text-decoration:underline;">${href}</a></p>
</td></tr>
<tr><td class="px" bgcolor="${INK}" style="background:${INK};padding:22px 44px 44px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="border-top:1px solid ${LINE};padding-top:20px;font-family:${SANS};font-size:13px;line-height:21px;color:${MUTED};">${note}</td></tr></table></td></tr>

<!-- Pie -->
<tr><td class="px" bgcolor="#0B1219" style="background:#0B1219;border-top:1px solid ${LINE};padding:36px 44px 38px;">
  <p style="margin:0 0 20px;font-family:${SANS};font-size:11px;line-height:16px;font-weight:700;${TRACK(1.8)}color:${AMBER};">INVESTIGAMOS · DESARROLLAMOS · IMPACTAMOS</p>
  <p style="margin:0 0 20px;font-family:${SANS};font-size:13px;line-height:24px;color:${SOFT};">${navLink("Proyectos", "/proyectos")}&nbsp;&nbsp;/&nbsp;&nbsp;${navLink("Publicaciones", "/publicaciones")}&nbsp;&nbsp;/&nbsp;&nbsp;${navLink("Equipo", "/equipo")}&nbsp;&nbsp;/&nbsp;&nbsp;${navLink("Bitácora", "/blog")}</p>
  <p style="margin:0 0 6px;font-family:${SANS};font-size:12px;line-height:19px;color:${MUTED};">Semillero de Investigación · Uniclaretiana<br>Quibdó, Chocó · Colombia</p>
  <p style="margin:0 0 22px;font-family:${SANS};font-size:11px;line-height:16px;${TRACK(1.2)}color:#566677;">05°41′ N · 76°39′ O</p>
  <p style="margin:0;padding-top:18px;border-top:1px solid ${LINE};font-family:${SANS};font-size:11px;line-height:17px;color:#657688;">Notificación automática sobre tu proceso de admisión. No respondas a este correo si el remitente es una cuenta sin atención.</p>
</td></tr>
<tr><td height="4" bgcolor="${AMBER}" style="height:4px;border-radius:0 0 12px 12px;background-color:${AMBER};background-image:linear-gradient(90deg,${AMBER} 0%,${c.accent} 100%);${EMPTY}">&nbsp;</td></tr>
</table></td></tr></table></body></html>`;

  const text = `SYNAPSE · SEMILLERO DE INVESTIGACIÓN\n\nHola, ${name}.\n\n${c.title}\n\n${c.message}\n\n${c.detail}\n\nPrograma académico: ${data.program}\nEstado: ${c.chip}\n\n${c.action}: ${url}\n\n${data.status === "PENDING" ? "Tu enlace es personal; consérvalo y no lo compartas." : "También puedes consultar con tu correo y el código recibido al registrarte."}\n\nInvestigamos · Desarrollamos · Impactamos\nSYNAPSE · Uniclaretiana · Quibdó, Chocó\n${PUBLIC_SITE_URL}\n`;
  return { subject: c.subject, html, text };
}
