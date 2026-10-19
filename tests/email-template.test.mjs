import test from 'node:test';
import assert from 'node:assert/strict';
import { renderAdmissionEmail } from '../src/lib/email/admission-template.ts';
import { sealTrackingCode, openTrackingCode, requireEmailConfiguration } from '../src/lib/email/secrets.ts';

const trackingUrl = 'https://www.semillerosynapse.com/seguimiento/' + 'Z'.repeat(43);
const data = { fullName: 'María López', program: 'Ingeniería de Sistemas', trackingUrl };

for (const status of ['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED']) {
  test(`renderiza correo institucional para ${status} con HTML y texto plano`, () => {
    const mail = renderAdmissionEmail({ ...data, status });
    assert.match(mail.html, /synapse-header-logo\.png/);
    assert.match(mail.html, /www\.semillerosynapse\.com/);
    assert.match(mail.html, /Uniclaretiana/);
    assert.match(mail.text, /María/);
    assert.match(mail.html, /TU RECORRIDO EN SYNAPSE/);
    assert.ok(mail.subject.endsWith('| SYNAPSE'));
  });
}

test('escapa contenido de postulantes contra inyección HTML', () => {
  const mail = renderAdmissionEmail({ ...data, fullName: '<script>alert(1)</script> Sol', program: '<img src=x onerror="alert(1)">', status: 'PENDING' });
  assert.doesNotMatch(mail.html, /<script>|<img src=x/);
  assert.match(mail.html, /&lt;script&gt;/);
  assert.match(mail.html, /&lt;img/);
});

test('solo permite enlaces de seguimiento en dominio oficial', () => {
  assert.throws(() => renderAdmissionEmail({ ...data, status: 'PENDING', trackingUrl: 'https://evil.example/seguimiento/123' }));
});

test('cifra y descifra el código privado con AES-GCM, sin exponerlo en la cola', () => {
  const original = process.env.EMAIL_LINK_ENCRYPTION_KEY;
  process.env.EMAIL_LINK_ENCRYPTION_KEY = 'fe'.repeat(32);
  try {
    const secret = 'Z'.repeat(43);
    const encrypted = sealTrackingCode(secret);
    assert.notEqual(encrypted, secret);
    assert.equal(openTrackingCode(encrypted), secret);
    assert.throws(() => openTrackingCode(encrypted.slice(0, -2) + 'XX'));
  } finally {
    if (original === undefined) delete process.env.EMAIL_LINK_ENCRYPTION_KEY;
    else process.env.EMAIL_LINK_ENCRYPTION_KEY = original;
  }
});

test('no permite habilitar notificaciones sin claves configuradas', () => {
  const previous = process.env.EMAIL_LINK_ENCRYPTION_KEY;
  delete process.env.EMAIL_LINK_ENCRYPTION_KEY;
  try { assert.throws(() => requireEmailConfiguration()); }
  finally { if (previous !== undefined) process.env.EMAIL_LINK_ENCRYPTION_KEY = previous; }
});
