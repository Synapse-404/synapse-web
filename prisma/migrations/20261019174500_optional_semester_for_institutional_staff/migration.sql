-- Personal docente y administrativo puede postularse sin semestre académico.
-- Estudiantes mantienen validación de semestre obligatorio en la API.
ALTER TABLE "AdmissionApplication" ALTER COLUMN "semester" DROP NOT NULL;
