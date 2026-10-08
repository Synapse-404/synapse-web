import test from 'node:test';
import assert from 'node:assert/strict';
import { extractTrackingCode, validateTrackingCredentials } from '../src/lib/admissions/tracking.ts';

const token = 'A'.repeat(43);
const email = 'usuario@miuniclaretiana.edu.co';

test('acepta el código de 32 bytes en base64url y URL previa de seguimiento', () => {
  assert.equal(extractTrackingCode(token), token);
  assert.equal(extractTrackingCode(`https://synapse.example.org/seguimiento/${token}`), token);
  assert.equal(extractTrackingCode(`/seguimiento/${token}`), token);
  assert.equal(extractTrackingCode(`https://synapse.example.org/seguimiento/${token}?utm_source=mail`), token);
});

test('rechaza códigos malformados y rutas ajenas', () => {
  for (const value of ['short', '../admin', '/admin/' + token, 'A'.repeat(44), 'A'.repeat(42), 'http://test/fake/' + token, 'javascript:alert(1)', '', ' '.repeat(3000)]) {
    assert.equal(extractTrackingCode(value), null, value.slice(0, 70));
  }
});

test('exige combinación correo institucional exacto + código privado', () => {
  assert.deepEqual(validateTrackingCredentials({ email: 'USUARIO@MIUNICLARETIANA.EDU.CO', trackingCode: token }), { email, trackingCode: token });
  for (const invalid of [
    { email: 'persona@gmail.com', trackingCode: token },
    { email: 'usuario@fake.miuniclaretiana.edu.co', trackingCode: token },
    { email, trackingCode: 'hola' },
    { email },
    null,
    [],
  ]) assert.equal(validateTrackingCredentials(invalid), null);
});
