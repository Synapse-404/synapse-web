import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInstitutionEmail, validateAdmissionInput } from '../src/lib/admissions/validation.ts';

const good = { fullName: 'María López', email: 'Estudiante@MIUNICLARETIANA.EDU.CO', program: 'Ingeniería de Sistemas', semester: 7, consent: true };

test('acepta únicamente @miuniclaretiana.edu.co, normaliza mayúsculas y espacios', () => {
  assert.equal(normalizeInstitutionEmail(' Estudiante@MiUniclaretiana.Edu.Co '), 'estudiante@miuniclaretiana.edu.co');
  assert.equal(normalizeInstitutionEmail('Profesor@uniclaretiana.edu.co'), null);
  assert.equal(normalizeInstitutionEmail('administracion@uniclaretiana.edu.co'), null);
});

test('rechaza el dominio de docentes, dominios externos, imitaciones y correos malformados', () => {
  for (const email of [
    'docente@uniclaretiana.edu.co', 'administracion@uniclaretiana.edu.co',
    'estudiante@gmail.com', 'profesor@outlook.com',
    'estudiante@miuniclaretiana.edu.co.evil.com',
    'estudiante@uniclaretiana.edu.co.evil.com',
    'estudiante@sub.miuniclaretiana.edu.co', 'estudiante@sub.uniclaretiana.edu.co',
    'estudiante@miuniclaretiana.edu.com', 'estudiante@fakeuniclaretiana.edu.co',
    'estudiante@uniclaretiana.edu.co.', 'estudiante@@uniclaretiana.edu.co',
    '.estudiante@miuniclaretiana.edu.co', 'estudiante..test@miuniclaretiana.edu.co',
    'estudiante@miuniclaretiana.edu.co.',
  ]) assert.equal(normalizeInstitutionEmail(email), null, email);
});

test('acepta postulación de estudiante y normaliza espacios', () => {
  const result = validateAdmissionInput({ ...good, fullName: '  María  López   ' });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.fullName, 'María López');
    assert.equal(result.data.email, 'estudiante@miuniclaretiana.edu.co');
    assert.equal(result.data.semester, 7);
  }
});

test('rechaza postulación de docente o administrativo incluso con todos los demás datos válidos', () => {
  for (const email of ['Docente@UNICLARETIANA.EDU.CO', 'administracion@uniclaretiana.edu.co']) {
    const result = validateAdmissionInput({ ...good, email, program: 'Coordinación Académica' });
    assert.equal(result.ok, false, email);
    if (!result.ok) assert.match(result.message, /miuniclaretiana\.edu\.co/);
  }
});

test('rechaza un registro sin semestre, incluso con el dominio permitido', () => {
  for (const semester of [null, undefined, '', 0, 11, 2.5, 'a']) {
    assert.equal(validateAdmissionInput({ ...good, semester }).ok, false, String(semester));
  }
});

test('rechaza correo externo incluso con el resto de datos válidos', () => {
  assert.equal(validateAdmissionInput({ ...good, email: 'a@gmail.com' }).ok, false);
});

test('exige consentimiento y semestre dentro de 1 a 10', () => {
  for (const raw of [{ ...good, consent: false }, { ...good, semester: null }, { ...good, semester: undefined }, { ...good, semester: 0 }, { ...good, semester: 11 }, { ...good, semester: 2.5 }, { ...good, semester: 'a' }]) {
    assert.equal(validateAdmissionInput(raw).ok, false);
  }
});

test('rechaza datos excesivamente largos y payload inválido', () => {
  assert.equal(validateAdmissionInput({ ...good, program: 'x'.repeat(121) }).ok, false);
  assert.equal(validateAdmissionInput({ ...good, fullName: 'x' }).ok, false);
  assert.equal(validateAdmissionInput(null).ok, false);
});
