# Rediseño UI/UX · Equipo SYNAPSE

## Rutas actualizadas

- `/equipo`: hero editorial, cifras dinámicas derivadas de `team.json`, directorio por áreas con búsqueda en tiempo real y filtros, tarjetas visuales y sección de vinculación.
- `/equipo/[id]`: página individual con portada, retrato/monograma de respaldo, biografía, responsabilidades, enlaces externos, compañeros del área y navegación anterior/siguiente.

## Integridad y arquitectura

- Los perfiles y redes se siguen cargando desde `src/data/team.json`. No se sustituyó información ni se modificó el backend, Prisma o las rutas de API.
- Los filtros se ejecutan en el cliente, sin peticiones adicionales. Las páginas individuales continúan con `generateStaticParams` y metadatos SEO.
- Estilos acotados a este segmento en `src/styles/team-pages.css`, importado desde `src/app/equipo/layout.tsx`. No altera las otras páginas.
- Componentes reutilizados: `TeamAvatar`, `TeamSocialLinks`. Los retratos con imagen ausente usan iniciales sin solicitar imágenes inexistentes.
- Las vistas incluyen pautas responsive, foco visible, controles etiquetados, contraste y soporte `prefers-reduced-motion`.

## Comprobación local

```bash
pnpm install
pnpm run validate:team
node --experimental-strip-types --test tests/team-directory.test.mjs
pnpm run build
```

La compilación completa necesita las dependencias del proyecto y la configuración de entorno requerida para la compilación, si corresponde.
