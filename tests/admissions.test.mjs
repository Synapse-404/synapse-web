import test from 'node:test';
import assert from 'node:assert/strict';
import { getInstitutionalApplicantType, normalizeInstitutionEmail, validateAdmissionInput } from '../src/lib/admissions/validation.ts';

const good = { fullName: 'María López', email: 'Estudiante@MIUNICLARETIANA.EDU.CO', program: 'Ingeniería de Sistemas', semester: 7, consent: true };

test('normaliza ambos dominios institucionales exactos sin importar mayúsculas ni espacios', () => {
  assert.equal(normalizeInstitutionEmail(' Estudiante@MiUniclaretiana.Edu.Co '), 'estudiante@miuniclaretiana.edu.co');
  assert.equal(normalizeInstitutionEmail(' Profesor@Uniclaretiana.Edu.Co '), 'profesor@uniclaretiana.edu.co');
  assert.equal(normalizeInstitutionEmail('administracion@uniclaretiana.edu.co'), 'administracion@uniclaretiana.edu.co');
  assert.equal(getInstitutionalApplicantType('Estudiante@miuniclaretiana.edu.co'), 'student');
  assert.equal(getInstitutionalApplicantType('Docente@uniclaretiana.edu.co'), 'staff');
  assert.equal(getInstitutionalApplicantType('persona@gmail.com'), null);
});

test('rechaza dominios externos, imitaciones y direcciones malformadas', () => {
  for (const email of [
    'estudiante@gmail.com', 'profesor@outlook.com',
    'estudiante@miuniclaretiana.edu.co.evil.com',
    'estudiante@uniclaretiana.edu.co.evil.com',
    'estudiante@sub.miuniclaretiana.edu.co', 'estudiante@sub.uniclaretiana.edu.co',
    'estudiante@miuniclaretiana.edu.com', 'estudiante@fakeuniclaretiana.edu.co',
    'estudiante@uniclaretiana.edu.co.',
    'estudiante@@uniclaretiana.edu.co', '.estudiante@miuniclaretiana.edu.co',
    'estudiante..test@uniclaretiana.edu.co',
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

test('permite postulación de docente o administrativo sin semestre académico', () => {
  for (const email of ['Docente@UNICLARETIANA.EDU.CO', 'administracion@uniclaretiana.edu.co']) {
    const result = validateAdmissionInput({ ...good, email, program: 'Coordinación Académica', semester: null });
    assert.equal(result.ok, true, email);
    if (result.ok) {
      assert.equal(result.data.email, email.toLowerCase());
      assert.equal(result.data.semester, null);
      assert.equal(result.data.program, 'Coordinación Académica');
    }
  }
});

test('ignora semestre académico enviado para personal docente y administrativo', () => {
  const result = validateAdmissionInput({ ...good, email: 'docente@uniclaretiana.edu.co', semester: 6 });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.data.semester, null);
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
