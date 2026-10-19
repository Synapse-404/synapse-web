import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { renderAdmissionEmail } from '../src/lib/email/admission-template.ts';

const directory = join(process.cwd(), 'docs/email-previews');
await mkdir(directory, { recursive: true });
const asset = await readFile(join(process.cwd(), 'public/synapse-header-logo.png'));
const inlineLogo = `data:image/png;base64,${asset.toString('base64')}`;
const items = [
  ['PENDING', '01 · Recibida'],
  ['IN_REVIEW', '02 · En revisión'],
  ['APPROVED', '03 · Aprobada'],
  ['REJECTED', '04 · No admitida'],
];
const previews = [];
for (const [status, label] of items) {
  const rendered = renderAdmissionEmail({
    fullName: 'Valentina Martínez',
    program: 'Ingeniería de Sistemas',
    status,
    trackingUrl: status === 'PENDING' ? 'https://www.semillerosynapse.com/seguimiento/' + 'A'.repeat(43) : 'https://www.semillerosynapse.com/seguimiento',
  });
  // La imagen embebida es SOLO para la vista previa offline: los correos reales
  // usan la URL pública del logo, compatible con proveedores de email.
  const preview = rendered.html.replace('https://www.semillerosynapse.com/synapse-header-logo.png', inlineLogo);
  const filename = `${status.toLowerCase()}.html`;
  await writeFile(join(directory, filename), preview);
  previews.push({ label, preview });
}
const esc = s => s.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/</g, '&lt;');
const index = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview de notificaciones · SYNAPSE</title><style>*{box-sizing:border-box}body{background:#121921;color:#f6f7f8;font:14px/1.5 system-ui,Arial,sans-serif;margin:0}header{max-width:1100px;margin:0 auto;padding:33px 24px 22px}h1{font-size:25px;letter-spacing:-1px;margin:0 0 6px}.sub{color:#9aa6af;font-size:13px;margin:0 0 24px}.nav{display:flex;gap:8px;flex-wrap:wrap}.nav button{background:#232d38;border:1px solid #35414a;color:#b9c4cc;font:inherit;border-radius:7px;padding:12px 18px;cursor:pointer}.nav button.active{background:#f8b934;color:#141c24;border-color:#f8b934;font-weight:700}.shell{padding:0 18px 20px;max-width:1100px;margin:0 auto}.viewport{border:1px solid #34414a;border-radius:12px;background:#fff;overflow:hidden;height:940px}iframe{width:100%;height:100%;border:0}small{color:#9facb9;display:block;margin-top:13px}@media(max-width:640px){.viewport{height:1100px}}</style></head><body><header><h1>Correos de admisión <span style="color:#f8b934">SYNAPSE</span></h1><p class="sub">Vista previa local · cuatro estados · logo original integrado · ejemplos ficticios (no envía correos)</p><nav class="nav" id="nav">${previews.map((item,i)=>`<button type="button" data-index="${i}"${i===0?' class="active"':''}>${esc(item.label)}</button>`).join('')}</nav></header><div class="shell"><div class="viewport"><iframe id="mailframe" title="Previsualización del correo de SYNAPSE" referrerpolicy="no-referrer" sandbox="allow-same-origin"></iframe></div><small>Los enlaces en la vista previa son demostrativos. En los correos reales se usan enlaces de seguimiento individuales y el logo alojado en semillerosynapse.com.</small></div><script>const previews=${JSON.stringify(previews.map(item=>item.preview)).replace(/</g,'\\u003c')};const frame=document.querySelector('#mailframe');const buttons=[...document.querySelectorAll('[data-index]')];function select(index){frame.srcdoc=previews[index];buttons.forEach((b,i)=>b.classList.toggle('active',i===index))}buttons.forEach((b,i)=>b.addEventListener('click',()=>select(i)));select(0);</script></body></html>`;
await writeFile(join(directory, 'vista-previa-correos-synapse.html'), index);
console.log(`Vistas previas generadas: ${directory}`);
