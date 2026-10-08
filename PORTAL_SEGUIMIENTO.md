# Portal de seguimiento de admisiones — SYNAPSE

Esta entrega amplía **la fase de admisiones existente**. No cambia los modelos Prisma ni elimina el panel administrativo, las páginas públicas, el SEO o la experiencia Three.js.

## Páginas y API

| Ruta | Función |
| --- | --- |
| `/seguimiento` | Nuevo portal para consultar una postulación con **correo institucional + código privado**. |
| `POST /api/seguimiento/consultar` | Valida credenciales y devuelve **solo datos públicos de esa solicitud**. |
| `/seguimiento/[token]` | Enlace privado existente, conservado por compatibilidad. Ahora comparte el nuevo diseño de seguimiento. |
| `/#contacto` | Formulario de inscripción existente. Ahora también muestra el código de seguimiento para copiarlo. |
| `/admin/solicitudes/[id]` | Coordinación cambia el estado; el portal refleja los cambios de PostgreSQL. |

## Instalación

Desde la raíz de la app:

```bash
pnpm install
pnpm exec prisma generate
pnpm dev
```

Configura antes el `DATABASE_URL` en `.env` y aplica las migraciones de la fase de admisiones si no lo has hecho:

```bash
pnpm exec prisma migrate dev --name init_admisiones
```

En producción usa `pnpm exec prisma migrate deploy`. **No se requiere una migración nueva específicamente para este portal.**

## Flujo de uso

1. Un aspirante se registra en `/#contacto` con correo `@miuniclaretiana.edu.co`.
2. El servidor crea su solicitud en `PENDING` y devuelve un enlace privado + un código secreto aleatorio de 32 bytes (43 caracteres base64url). En BD **solo se almacena SHA-256 del código**.
3. El formulario confirma el registro y ofrece copiar el código o el enlace. El usuario debe guardarlo: **no se envían correos automáticos** en esta fase.
4. En `/seguimiento`, el aspirante introduce el **mismo correo institucional** y el código o enlace. El servidor verifica ambos antes de devolver datos.
5. La página presenta el estado, etapas, datos mínimos de la postulación y eventos del historial. **No devuelve las notas internas** del comité ni datos de otras personas.
6. La coordinación actualiza el estado mediante el dashboard; el portal refleja esa decisión en la siguiente consulta.

## Estados

- `PENDING` → **Recibida**.
- `IN_REVIEW` → **En revisión**.
- `APPROVED` → **Aprobada / Admitida**.
- `REJECTED` → **No admitida**.

## Seguridad y limitaciones operativas

- El portal no permite encontrar una solicitud a partir de una dirección de correo sola.
- El código privado es un *bearer secret*. La ruta previa `/seguimiento/[token]` sigue siendo accesible a quien tenga el enlace; el usuario debe mantenerlo privado.
- El portal consulta por POST y responde `Cache-Control: private, no-store`; ni el email ni el código aparecen en el URL de la consulta mediante formulario.
- La página devuelve únicamente nombre, carrera, semestre, estado, fechas e historial de estados. **Nunca expone notas del personal administrativo**.
- La ruta nueva se declara `noindex`; las rutas de seguimiento también usan cabeceras anti-indexación y sin `Referer`.
- **No existe verificación de propiedad del correo institucional**. Comprobar el dominio no constituye verificación de identidad. Para producción se recomienda enviar un email verificable o integrar SSO institucional.
- La recuperación de un código perdido requiere **verificación de identidad por coordinación**. No se implementó un envío automático de nuevos códigos ni búsquedas por email para evitar filtraciones.
- Antes de exponer públicamente la API, se debe incorporar **rate limiting persistente por IP / huella**, preferentemente en infraestructura o Redis/Upstash, además de monitoreo y controles antiabuso.

## Pruebas

```bash
pnpm run test:admissions
node --experimental-strip-types --test tests/tracking.test.mjs
pnpm build
```

Prueba manualmente con una instancia PostgreSQL:

1. Registra una solicitud, copia su código y consulta `/seguimiento`.
2. Prueba con email externo o código incorrecto: debe fallar sin revelar datos.
3. Cambia la solicitud a `APPROVED` / `REJECTED` desde `/admin/solicitudes/[id]`; recarga la consulta y verifica que cambien la etiqueta, explicación e historial.
4. Abre un enlace `/seguimiento/<token>` existente para verificar compatibilidad.
5. Verifica la experiencia responsive, especialmente en 320px, 390px y escritorio.

## Conventional Commit

`feat(admisiones): crear portal público para consultar estados y resultados de postulación`
