# SYNAPSE · Automatización de Vercel y página 404

## Despliegue automático con pnpm y Prisma 7

Al desplegar en **Vercel Production** y utilizar el comando de construcción estándar (`pnpm run build`), ahora ocurre esta secuencia:

1. `pnpm run db:generate` → genera Prisma Client.
2. `pnpm run validate:team` → valida los datos públicos existentes.
3. `pnpm run vercel:bootstrap` → **solo cuando `VERCEL=1` y `VERCEL_ENV=production`**:
   - Comprueba la presencia de `DATABASE_URL`.
   - Ejecuta `pnpm exec prisma migrate deploy` (aplica solamente migraciones previamente versionadas).
   - Si ambas variables de bootstrap están configuradas, ejecuta `pnpm exec tsx scripts/create-admin.ts`.
   - Si el correo administrativo ya existe, conserva la cuenta y su contraseña sin modificarlas.
4. `next build`.

No se realizan migraciones ni bootstrap administrativo durante `pnpm build` local, ni al construir un deployment Preview de Vercel. Se conserva el comando manual:

```bash
pnpm exec tsx scripts/create-admin.ts
```

### Configurar variables en Vercel

En **Project > Settings > Environment Variables**, configura para el entorno **Production**:

```dotenv
DATABASE_URL="postgresql://<usuario>:<contraseña>@<host>:5432/<db>?sslmode=require"
ADMIN_BOOTSTRAP_EMAIL="coordinacion@uniclaretiana.edu.co"
ADMIN_BOOTSTRAP_PASSWORD="<contraseña_larga_unica_de_al_menos_12_caracteres>"
ADMIN_BOOTSTRAP_NAME="Coordinación SYNAPSE"
```

`DATABASE_URL` debe conectar con una base PostgreSQL que permita migraciones. **No subas secretos al repositorio.** Vercel puede ocultar el valor de las variables sensibles; no imprimas contraseñas en los logs.

Después del **primer deployment exitoso**, elimina en Vercel las variables `ADMIN_BOOTSTRAP_PASSWORD`, `ADMIN_BOOTSTRAP_EMAIL` y `ADMIN_BOOTSTRAP_NAME`. Los siguientes despliegues seguirán aplicando migraciones y conservarán la cuenta creada. Una migración errónea detendrá el build en vez de publicar código incompatible con el schema.

Si en Vercel tienes configurado un **Build Command personalizado**, usa `pnpm run build` o `pnpm run vercel-build` para incluir la automatización. **Root Directory** debe apuntar al directorio que contiene `package.json`. Asegúrate de incluir `prisma/migrations/**` en Git, y de que el `DATABASE_URL` de **Preview** no apunte a la base de producción.

> Este bootstrap crea el primer administrador, **no** inventa ni inserta postulaciones, integrantes, proyectos o artículos: esos últimos contenidos siguen usando los JSON públicos del proyecto, mientras las solicitudes y cuentas de administrador se guardan en PostgreSQL.

### Seguridad operativa

- No se sobrescriben credenciales de administradores existentes.
- Las migraciones se aplican en producción con `migrate deploy`, nunca `migrate dev`.
- No se escribe contraseña alguna en el código ni en la salida del script.
- Una compilación desde Vercel necesita conectividad desde el builder hasta PostgreSQL. Una base con restricción de IP o suspensión puede impedir el despliegue.
- Para pipelines con alta concurrencia, considera mover migraciones a una etapa CI/CD separada y usar una conexión directa no agrupada para migraciones.

## Página 404

- Archivo: `src/app/not-found.tsx`.
- Estilos encapsulados: `src/styles/not-found.css`.
- Fondo: `/metal-human.mp4` (archivo solicitado), en autoplay, loop, muted, playsInline; `/metal-human.jpg` como poster.
- Identidad: negro profundo, marfil y amarillo SYNAPSE (`--amber`); 404 editorial y figuras geométricas circulares con cuadrícula.
- Responsive y fallback `prefers-reduced-motion`: se oculta video y queda poster estático.
- No se cambian páginas públicas, portal de admisiones ni dashboard.

**Rendimiento:** `metal-human.mp4` pesa aprox. 55 MB. El recurso original se respeta porque así se solicitó; para producción con usuarios móviles recomendamos pasar a `/metal-human-optimized.mp4` (ya existe en `public/`, aprox. 1.7 MB) y conservar el archivo original de respaldo.

## Pruebas rápidas

```bash
pnpm run test:admissions
pnpm run test:tracking
pnpm run build
```

Para visualizar el 404 en Next.js, entra a una URL inexistente, por ejemplo `/ruta-que-no-existe`.
