# SYNAPSE — Rediseño del acceso y optimización de datos

## Interfaces
- `/admin/login`: nueva pantalla dividida con video optimizado (1,7 MB), recuperación visual cuando falla el video y soporte `prefers-reduced-motion`. Se conservan login, validaciones, cookies y redirección a `/admin`.
- `/seguimiento`: nueva portada editorial, consulta privada y guía de etapas. Mismo endpoint y modelo de resultados; `/seguimiento/[token]` mantiene su compatibilidad y ahora comparte la identidad visual.
- Sin cambios en Prisma schema ni migraciones. No se alteraron los datos, el contenido público o el 404.

## Acceso a PostgreSQL
- Cliente Prisma reutilizado por instancia (`getDb`), `DATABASE_POOL_MAX` configurable (2 por defecto en Vercel, 5 en local), timeout de conexión de 5 s, conexiones inactivas liberadas a los 10 s. **Cada instancia tiene su propio pool; el proveedor debe ofrecer pooling externo para escalar.**
- Para Vercel y PostgreSQL administrado: `DATABASE_URL` debe apuntar al **pooler** y `DIRECT_URL` a la conexión **directa** para Prisma CLI y migraciones. Ambas URLs deben apuntar a la misma base.
- Dashboard: `groupBy` por estado y 6 resultados recientes, en dos consultas concurrentes; sin cachear datos privados.
- Sesiones administrativas: se eliminó `deleteMany` de sesiones vencidas en cada login. Se valida `expiresAt` en cada lectura. Configurar purga periódica según política de retención en el futuro.
- `getAdmin` usa `react.cache` por petición de render para evitar solicitudes duplicadas al servidor.
- Listado ordenado por `createdAt` + `id` para paginar de modo determinista. Para decenas de miles de solicitudes, planificar paginación por cursor y búsqueda indexada.
- API públicas alimentadas exclusivamente por JSON estáticos (`/api/blog`, `/api/events`, `/api/projects`, `/api/publications`, `/api/team`) permiten cache CDN de 5 min con stale-while-revalidate; **no se cachea información personal ni administrativa**.

## Configuración recomendada en Vercel
1. Establecer `DATABASE_URL` con la URL *pooled* del proveedor (Neon/Supabase/Prisma Postgres u otro) y `DIRECT_URL` con la URL directa del **mismo** Postgres (migraciones). Si el proveedor no ofrece una URL pooled, configurar un pooler transaccional externo y límites acordes a su plan.
2. Definir `DATABASE_POOL_MAX=2` inicialmente; aumentar solo tras medir concurrencia y límites de sesiones del servidor.
3. Ejecutar Vercel Functions en la región más cercana a PostgreSQL: el tiempo de ida y vuelta puede dominar la latencia.
4. El plan de base de datos debe proporcionar alta disponibilidad, copias de seguridad verificadas, alertas y un acuerdo de servicio adecuado. Esta entrega no crea réplicas ni garantiza uptime.
5. Separar `DIRECT_URL` del pooler es importante para transacciones y migraciones. Si se usa una sola URL directa con tráfico serverless, hay riesgo de agotar las conexiones.
6. Medir p50/p95/p99 de `/api/seguimiento/consultar`, `/api/admisiones` y `/admin` con herramientas de observabilidad; probar carga sobre *staging*, no sobre producción.
7. Las APIs de datos estáticos usarán CDN; al actualizar sus JSON, desplegar una nueva versión. Puede persistir una respuesta anterior hasta 5 minutos.

## Comprobaciones
```bash
pnpm install
pnpm exec prisma validate
pnpm exec prisma generate
pnpm exec tsc --noEmit
pnpm test:admissions
pnpm test:tracking
pnpm test:db-pool
pnpm build
```

Nota de seguridad: el flujo original de seguimiento con token y correo sigue sin verificación de propiedad del correo institucional. Para producción, añadir email OTP / SSO institucional, rate limiting persistente por IP/identidad y protección contra abuso.

## Disponibilidad y salud
`GET /api/health` comprueba conectividad básica con PostgreSQL y responde `200` (`ok`) o `503` (`unavailable`), sin datos privados. Puede usarse con supervisión externa cada 1–5 minutos; no garantiza alta disponibilidad ni verifica todas las tablas y procesos.
