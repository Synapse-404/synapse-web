# Sitio web del Semillero de Investigación SYNAPSE

Sitio web del Semillero de Investigación SYNAPSE de la Fundación Universitaria Claretiana, sede Quibdó. La plataforma comunica la identidad del semillero, su propósito, líneas de trabajo, impacto esperado, equipo y mecanismos de vinculación.

## Sobre SYNAPSE

SYNAPSE es un semillero de investigación enfocado en el desarrollo de soluciones de software y en la generación de conocimiento que aportan al crecimiento académico y social.

El semillero trabaja desde un enfoque territorial, orientado a transformar realidades locales mediante tecnología, investigación, desarrollo de software y análisis de datos.

## Lema

```txt
Investigamos · Desarrollamos · Impactamos
```

## Propósito

Usar la investigación y el desarrollo de software como herramientas para construir un futuro más inclusivo, sostenible y con mejores oportunidades académicas y sociales.

SYNAPSE busca que la tecnología no sea solo un ejercicio técnico, sino una herramienta para responder a necesidades reales del territorio.

## Enfoque Territorial

El semillero desarrolla sus actividades con énfasis en Quibdó, Chocó, con el objetivo de generar soluciones tecnológicas que respondan a problemáticas reales de la comunidad.

Este enfoque busca contribuir al bienestar:

- Social.
- Ambiental.
- Educativo.
- Tecnológico.

## Líneas de Investigación

### Inteligencia Artificial

Aplicación de técnicas de aprendizaje automático, análisis de datos y modelos predictivos para abordar problemáticas sociales, educativas y ambientales.

### Desarrollo de Software

Diseño y construcción de soluciones de software innovadoras, escalables y centradas en el usuario, orientadas a necesidades del entorno local.

## Impacto Esperado

### Educativo

Contribuir a reducir la deserción, fortalecer la permanencia académica y mejorar la calidad educativa en la región.

### Social

Promover la convivencia, la inclusión y el bienestar en comunidades e instituciones.

### Ambiental

Apoyar la gestión del riesgo, la adaptación al cambio climático y la toma de decisiones informada.

### Tecnológico

Desarrollar soluciones que usen datos, software e innovación para transformar realidades locales.

## Invitación

SYNAPSE invita a estudiantes interesados en la tecnología, la investigación y el impacto comunitario a vincularse al semillero.

Quienes participan pueden:

- Aprender habilidades en investigación, análisis de datos y desarrollo de software.
- Innovar mediante soluciones aplicadas a problemáticas reales.
- Transformar su comunidad a través de proyectos con impacto positivo y sostenible.

## Stack Técnico

- Next.js 16.
- React 19.
- TypeScript.
- Tailwind CSS.
- Sonner para notificaciones.
- pnpm.

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm run dev
```

Abrir:

```txt
http://localhost:3000
```

## Scripts

```bash
pnpm run dev
pnpm run build
pnpm run start
pnpm run lint
```

## Estructura Base

```txt
src/
  app/         Rutas, páginas y endpoints
  components/  Componentes reutilizables
  data/        Contenido estático en JSON
  styles/      Estilos globales
  types/       Tipos TypeScript
public/        Recursos públicos
```

## Nota

El contenido del sitio está organizado para poder migrarse posteriormente a un CMS. Mientras tanto, la información se administra desde archivos JSON en `src/data`.

## Administrar integrantes del equipo

La fuente única es `src/data/team.json`. El inicio, `/equipo`, los perfiles
`/equipo/[id]` y `GET /api/team` obtienen los integrantes de ese archivo.

1. Guarda la fotografía en `public/team/` (crea la carpeta si no existe) o utiliza una URL HTTPS pública.
2. Añade o modifica el integrante en el JSON. Usa una ruta como `/team/nombre.jpg`, sin el prefijo `public`.
3. Ejecuta `pnpm run validate:team`. La compilación también ejecuta esta validación.
4. Guarda y publica los cambios mediante el despliegue habitual. En producción hace falta volver a compilar y desplegar para actualizar las páginas estáticas.

Ejemplo de estructura (reemplaza los datos y enlaces de ejemplo antes de añadirlo):

```json
{
  "id": "nuevo-integrante",
  "name": "Nombre completo",
  "role": "Integrante de desarrollo",
  "group": "desarrollo",
  "groupRole": "Desarrollo",
  "bio": "Presentación del integrante.",
  "responsibilities": ["Responsabilidad principal.", "Otra responsabilidad."],
  "image": null,
  "featured": false,
  "social": {
    "github": "https://github.com/usuario",
    "linkedin": "https://www.linkedin.com/in/usuario",
    "instagram": "https://www.instagram.com/usuario",
    "website": "https://example.com"
  }
}
```

- `id`: identificador único y estable para la URL del perfil; usa letras sin tildes, números, guiones o guiones bajos.
- `group`: `docente`, `coordinación`, `investigación`, `desarrollo` o `documentación`.
- `image`: ruta local o URL HTTPS. Con `null`, sin imagen o si la carga falla, se muestran las iniciales. Las imágenes locales usan la optimización de Next.js; las externas se cargan directamente desde su URL.
- `featured`: el inicio muestra como máximo los primeros cuatro integrantes con `true`, siguiendo el orden del JSON. La página `/equipo` conserva el listado completo.
- `social`: añade únicamente redes reales. Puedes omitirlo o usar `{}`. Se admiten más redes, como `facebook`, `x`, `youtube`, `tiktok` u `orcid`; cualquier otra clave se muestra como etiqueta del enlace.
## Admisiones · notificaciones por correo (octubre de 2026)

El formulario acepta **exclusivamente** ambos dominios institucionales: 
`@miuniclaretiana.edu.co` para estudiantes y `@uniclaretiana.edu.co` para
personal docente y administrativo. Se validan las direcciones en frontend y en
servidor; el portal de seguimiento utiliza la misma validación. No se aceptan
subdominios, Gmail ni dominios similares. Para estudiantes se exige el semestre
(1 a 10); para docentes y administrativos se solicita el área o dependencia y
**no se exige semestre** (se guarda `NULL` en PostgreSQL). Esta adaptación requiere
ejecutar la migración `20261019174500_optional_semester_for_institutional_staff`
mediante `pnpm db:deploy` antes de utilizar el nuevo formulario en producción.
La solicitud queda inicialmente **Recibida**, NO concede membresía automática. Cada cambio realizado por un
administrador genera una notificación institucional al mismo correo:

| Estado | Asunto | Destino del botón |
| --- | --- | --- |
| PENDING · Recibida | Recibimos tu postulación | Enlace privado de seguimiento |
| IN_REVIEW · En revisión | Estamos revisando tu postulación | Portal de seguimiento |
| APPROVED · Aprobada | ¡Tu postulación fue aprobada! | Portal de seguimiento |
| REJECTED · No admitida | Actualización de tu postulación | Portal de seguimiento |

Los cambios posteriores **no contienen el código privado**; el estudiante
consulta el portal usando el enlace/código recibido en el primer correo y
su correo institucional. Las notas de revisión administrativas no se divulgan.

### 1. Configurar Resend y autenticación del dominio

1. Crear una cuenta en [Resend](https://resend.com), abrir **Domains** y agregar
   `semillerosynapse.com` (o configurar el subdominio de envío correspondiente,
   en cuyo caso actualizar `EMAIL_FROM`).
2. Publicar los registros DNS de **SPF y DKIM** que muestre Resend en la zona
   DNS del dominio; configurar **DMARC** según la política institucional.
   **El hecho de hospedar la web en el dominio NO autoriza automáticamente a enviar correo desde él.**
3. Esperar a que Resend marque el dominio como **Verified**.
4. Generar una API key de envío y configurar las variables en Vercel
   (**Settings → Environment Variables**, entorno Production). Consultar
   `.env.example`; NO incluir claves reales en commits.
5. En producción, usar `EMAIL_FROM="SYNAPSE <admisiones@semillerosynapse.com>"`.
   Opcionalmente, configurar `EMAIL_REPLY_TO` con un buzón atendido.

Variables indispensables: `DATABASE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`,
`EMAIL_LINK_ENCRYPTION_KEY` (64 caracteres hexadecimales), `CRON_SECRET`
(aleatorio largo). Generar las dos últimas con `openssl rand -hex 32`.
**No cambiar `EMAIL_LINK_ENCRYPTION_KEY` mientras existan confirmaciones
pendientes** o no podrán descifrarse. No reutilizar la misma clave para cron.

**Comportamiento fail-closed:** si faltan los parámetros de envío, el endpoint
de registro responderá 503, sin insertar una solicitud que no pueda
notificarse. Un error temporal del proveedor **no revierte una inscripción ya
almacenada**; el correo queda en cola y el usuario conserva su código privado.

### 2. Migración y despliegue

```bash
pnpm install --frozen-lockfile
pnpm run db:generate
pnpm run db:deploy
pnpm run build
```

En **Vercel Production** el script `prepare-vercel.mjs` existente ya ejecuta
`prisma migrate deploy` durante el build, después de generar el cliente.
Si el despliegue y la base de datos se gestionan manualmente, ejecutar
`pnpm run db:deploy` antes de activar el formulario.

### 3. Cola durable de notificaciones y reintentos

Cada alta/cambio guarda su `AdmissionStatusEvent` y su
`AdmissionEmailNotification` en la **misma transacción SQL**. Después se hace
el envío inmediato mediante HTTPS hacia la API de Resend. La cola usa estados
`PENDING`, `SENDING`, `SENT` y `FAILED` con hasta 8 intentos, backoff, leases
para concurrencia e `Idempotency-Key` por notificación. Las claves idempotentes
de Resend tienen ventana de 24 horas: no son garantía de deduplicación eterna.

El token de acceso inicial está **cifrado con AES-256-GCM** mientras el mensaje
está pendiente. Tras el envío exitoso se elimina de la cola; en la tabla de
solicitudes solo se almacena el hash SHA-256 del token. No registrar ni
compartir credenciales de acceso.

`vercel.json` programa una recuperación diaria a las **10:00 UTC (05:00
Colombia)**. La invocación se autentica con `CRON_SECRET` y procesa hasta 15
correos por ejecución, en grupos de 3. **En Vercel Hobby no se permiten cron
más frecuentes que diarios.** El envío inmediato funciona en cualquier plan;
para reintentos más rápidos configurar un cron de mayor frecuencia en un plan
que lo soporte o un worker externo, sin duplicar el programador.

Consultar el estado de cada notificación desde
`/admin/solicitudes/[id]` → Historial. Las notificaciones `FAILED`
requieren investigación de configuración/credenciales y reactivación
operativa; no se reenvían solas una vez alcanzado el límite de intentos.

### 4. Vista previa institucional y pruebas

```bash
pnpm run test:admission-flow
pnpm run email:preview
```

Abrir `docs/email-previews/vista-previa-correos-synapse.html` en el navegador;
contiene los cuatro diseños y el logo original **embebido solo en el preview**.
Los correos reales cargan el logo mediante la URL pública
`https://www.semillerosynapse.com/synapse-header-logo.png`.
No envía mensajes reales ni expone credenciales.

Para una prueba real de punta a punta, configurar las variables, realizar una
inscripción con una cuenta institucional bajo el dominio permitido y comprobar
el mensaje en el buzón (incluido spam). Desde el panel administrativo cambiar
su estado y verificar el segundo correo y la auditoría. Confirmar además los
registros del envío en el panel de Resend. La aceptación por parte de Resend
no garantiza por sí sola la entrega final a Inbox; monitorizar rebotes y
reputación del dominio.

**Alcance:** esta función notifica cambios de admisión. La identidad del
correo electrónico se valida por su dominio y por la entrega de mensajes,
pero no implementa un login SSO/OTP ni concede acceso a sistemas privados del
semillero. Para controlar recursos privados, exigir una autenticación
institucional independiente y autorización por estado `APPROVED`.
