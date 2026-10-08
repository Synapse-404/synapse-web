# SYNAPSE — Admisiones y dashboard (fase 1)

Implementación modular sobre **Next.js 16 + App Router + Prisma 7 + PostgreSQL + pnpm**.

## 1. Preparar el entorno

Desde la raíz del proyecto (`synapse-web` / carpeta que contiene `package.json`):

```bash
pnpm install
pnpm approve-builds        # Si pnpm bloquea los scripts de prisma / @prisma/engines / esbuild
cp .env.example .env
```

Edita `.env` con la cadena **real** de PostgreSQL en `DATABASE_URL`. El ejemplo usa Docker local; no corresponde a ninguna base alojada ni crea credenciales de producción. Conserva `SITE_URL=http://localhost:3000` para trabajar localmente, y actualízala al dominio real al desplegar.

Si necesitas PostgreSQL local, puedes ejecutar:

```bash
docker run --name synapse-postgres -e POSTGRES_USER=synapse -e POSTGRES_PASSWORD=synapse_local_dev -e POSTGRES_DB=synapse -p 5432:5432 -v synapse_pgdata:/var/lib/postgresql/data -d postgres:17
```

Si ya tienes PostgreSQL en Neon, Supabase, Azure o Render, utiliza la URL que proporciona ese servicio. Verifica TLS y pooling de conexiones para producción.

**Importante:** el proyecto incluía `prisma7.config.ts`, que se renombró a `prisma.config.ts` para que Prisma 7 lo detecte automáticamente.

## 2. Crear las tablas

```bash
pnpm exec prisma validate
pnpm exec prisma generate
pnpm exec prisma migrate dev --name init_admisiones
pnpm exec prisma studio
```

Prisma Studio es opcional. `prisma migrate dev` requiere una instancia PostgreSQL accesible. En despliegues con migraciones ya versionadas ejecuta `pnpm exec prisma migrate deploy` durante la fase de despliegue: **no uses** `migrate dev` en producción.

Los modelos iniciales son:

- `AdmissionApplication`: datos de postulación, estado, consentimiento, huella de enlace privado.
- `AdmissionStatusEvent`: historial auditable de cambios.
- `AdminUser`: identidad del administrador y verificador de contraseña scrypt.
- `AdminSession`: sesiones persistentes con tokens aleatorios **hasheados**.

## 3. Crear el primer administrador

Añade **temporalmente** estas tres variables a tu `.env` local (no se incluyen contraseñas reales en el ZIP):

```dotenv
ADMIN_BOOTSTRAP_EMAIL="coordinacion@miuniclaretiana.edu.co"
ADMIN_BOOTSTRAP_PASSWORD="REEMPLAZAR_CON_CONTRASENA_UNICA_DE_12_O_MAS_CARACTERES"
ADMIN_BOOTSTRAP_NAME="Coordinación SYNAPSE"
```

Crea el usuario una sola vez:

```bash
pnpm exec tsx scripts/create-admin.ts
```

El programa impide sobrescribir administradores existentes. **Elimina después del `.env` las variables `ADMIN_BOOTSTRAP_PASSWORD`, `ADMIN_BOOTSTRAP_EMAIL` y `ADMIN_BOOTSTRAP_NAME`.** No las configures como variables permanentes de despliegue. Si tu base de datos es remota, ejecuta el bootstrap desde una máquina confiable usando una conexión segura.

Inicia el servidor:

```bash
pnpm dev
```

## 4. Rutas implementadas

| Ruta | Propósito | Acceso |
| --- | --- | --- |
| `/#contacto` | Formulario integrado al diseño original | Público |
| `POST /api/admisiones` | Validación + persistencia + enlace de seguimiento | Público |
| `/seguimiento/{token}` | Consultar estado e historial de una postulación | Token privado generado al enviar |
| `/admin/login` | Ingreso de administradores | Público (credenciales necesarias) |
| `/admin` | Indicadores, distribución, entradas recientes e inventario editorial | Administrador |
| `/admin/solicitudes` | Búsqueda, filtros, paginación | Administrador |
| `/admin/solicitudes/{id}` | Ficha y revisión, historial de decisiones | Administrador |
| `PATCH /api/admin/admisiones/{id}` | Cambiar estado y registrar evento de auditoría | Administrador |
| `/admin/contenidos` | Inventario de proyectos, publicaciones, bitácora, participantes | Administrador; lectura |
| `/admin/evidencias` | Diseño del futuro módulo de archivos | Administrador; sin cargas |

### Ejemplo de POST

```bash
curl -X POST http://localhost:3000/api/admisiones \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Andrea Palacios","email":"andrea@miuniclaretiana.edu.co","program":"Ingeniería de Sistemas","semester":6,"consent":true}'
```

Devuelve HTTP **201** con `{ "message": "...", "trackingPath": "/seguimiento/<token>" }`. Copia ese enlace; no se envía email automáticamente. Una dirección ya registrada devuelve **409**, y un dominio no permitido devuelve **422**.

## 5. Restricción institucional y alcance de seguridad

La validación comprueba por **igual en frontend y backend** que el dominio normalizado sea **exactamente** `miuniclaretiana.edu.co`. No se permiten Gmail, dominios similares ni subdominios. PostgreSQL impone un índice único al correo normalizado.

**Validar el dominio declarado NO demuestra que la persona controle esa cuenta.** Esta primera fase no envía un código de verificación ni utiliza inicio de sesión institucional. Antes de decisiones de admisión en producción incorpora verificación por email con un proveedor SMTP/transaccional o SSO institucional (Microsoft Entra ID, si la universidad lo utiliza) y mantén la admisión en revisión hasta verificar identidad.

Seguridad incluida: sesiones del administrador con cookie `HttpOnly`, `Secure` en producción, `SameSite=Lax`, expiración de siete días; passwords con `scrypt` y sal aleatoria; bloqueo temporal tras cinco intentos; control de permisos en servidor; enlaces de seguimiento de alta entropía cuyo hash se almacena en BD; cabeceras `noindex` / `no-referrer` / `no-store` en páginas privadas; validaciones estrictas y audit trail de cambios.

Para producción todavía se requieren: **rate limit de escritura perimetral**, protección contra bots (por ejemplo, Turnstile), monitoreo/alertas, política pública de tratamiento de datos y retención, copias de seguridad, verificación de correo, notificaciones de admisión y pruebas de integración con PostgreSQL. Las páginas de contenido siguen leyendo los JSON existentes: aún no existe CRUD de proyectos, artículos, equipo ni evidencias. El sistema **no afirma** gestionar esos módulos en BD.

## 6. Comprobaciones

```bash
pnpm run test:admissions
pnpm run db:generate
pnpm build
```

También prueba manualmente:
1. Registro válido (`201`) con email institucional y link de seguimiento.
2. Registro `gmail.com` y dominio parecido (rechazados con `422`).
3. Duplicado de email institucional (`409`).
4. Login `admin/login`, consulta a `admin/solicitudes`, cambio de estado; la página de seguimiento debe reflejarlo.
5. Navegación a `/admin` sin sesión (debe ir a login).

**Nota:** este ZIP no incluye conexión PostgreSQL ni migraciones aplicadas sobre un servidor real. Ejecuta los comandos de la sección 2 antes de probar el flujo completo.


## Actualización: portal de seguimiento

Se añadió `/seguimiento` para consultar una solicitud con correo institucional y código privado. La API de consulta está en `POST /api/seguimiento/consultar`. El formulario ahora muestra el código al completar el registro. Los enlaces privados anteriores `/seguimiento/[token]` siguen funcionando. Consulta `PORTAL_SEGUIMIENTO.md` para los pasos, controles de seguridad y pruebas. Esta actualización no cambia el esquema Prisma.
