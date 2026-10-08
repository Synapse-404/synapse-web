import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInstitutionEmail, validateAdmissionInput } from '../src/lib/admissions/validation.ts';

const good = { fullName: 'María López', email: 'Estudiante@MIUNICLARETIANA.EDU.CO', program: 'Ingeniería de Sistemas', semester: 7, consent: true };

test('normaliza y permite únicamente el dominio institucional exacto', () => {
  assert.equal(normalizeInstitutionEmail(' Estudiante@MiUniclaretiana.Edu.Co '), 'estudiante@miuniclaretiana.edu.co');
  for (const email of [
    'estudiante@gmail.com', 'estudiante@uniclaretiana.edu.co',
    'estudiante@miuniclaretiana.edu.co.evil.com', 'estudiante@sub.miuniclaretiana.edu.co',
    'estudiante@@miuniclaretiana.edu.co', '.estudiante@miuniclaretiana.edu.co',
    'estudiante..test@miuniclaretiana.edu.co',
  ]) assert.equal(normalizeInstitutionEmail(email), null, email);
});

test('acepta postulación completa y normaliza espacios', () => {
  const result = validateAdmissionInput({ ...good, fullName: '  María  López   ' });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.fullName, 'María López');
    assert.equal(result.data.email, 'estudiante@miuniclaretiana.edu.co');
    assert.equal(result.data.semester, 7);
  }
});

test('rechaza correo externo incluso con el resto de datos válidos', () => {
  assert.equal(validateAdmissionInput({ ...good, email: 'a@gmail.com' }).ok, false);
});

test('exige consentimiento y semestre dentro de 1 a 10', () => {
  for (const raw of [{ ...good, consent: false }, { ...good, semester: 0 }, { ...good, semester: 11 }, { ...good, semester: 2.5 }, { ...good, semester: 'a' }]) {
    assert.equal(validateAdmissionInput(raw).ok, false);
  }
});

test('rechaza datos excesivamente largos y payload inválido', () => {
  assert.equal(validateAdmissionInput({ ...good, program: 'x'.repeat(121) }).ok, false);
  assert.equal(validateAdmissionInput({ ...good, fullName: 'x' }).ok, false);
  assert.equal(validateAdmissionInput(null).ok, false);
});
