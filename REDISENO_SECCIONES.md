# SYNAPSE — Rediseño de equipo, proyectos y publicaciones

## Alcance

Se rediseñaron seis rutas del App Router:

- `/equipo` y `/equipo/[id]`
- `/proyectos` y `/proyectos/[slug]`
- `/publicaciones` y `/publicaciones/[id]`

## Decisiones técnicas

- El lenguaje visual combina portada oscura editorial, geometrías abstractas y amarillo institucional `#F5A800`, con secciones en papel claro para la lectura prolongada.
- Las páginas de catálogo comparten `ShowcaseHero` y `CollectionHeading`.
- Los tres directorios incluyen filtrado por estado/área/tipo y búsqueda reactiva, normalizada para mayúsculas y acentos.
- Los detalles comparten `DetailHero`, `DetailBlock`, `DetailFacts` y `RelatedNavigation`.
- Los estilos de las seis rutas se aíslan mediante `.showcase-page` en `src/styles/showcase.css`. No se modificaron los estilos antiguos de la portada ni del dashboard.
- Se mantienen las rutas, los datos en `src/data`, la semántica SEO, los enlaces a perfiles/proyectos/publicaciones y sus páginas dinámicas.
- No se fabrican fichas académicas. Los enlaces externos con valor `#` no se presentan como recursos disponibles.
- Se incluyen estados vacíos, indicadores de filtros y navegación entre registros.

## Archivos principales

- `src/components/showcase/ShowcaseHero.tsx`
- `src/components/showcase/CollectionHeading.tsx`
- `src/components/showcase/CatalogDirectories.tsx`
- `src/components/showcase/DetailElements.tsx`
- `src/styles/showcase.css`
- Las seis páginas de las rutas indicadas.
- `src/app/layout.tsx` incorpora la hoja de estilos nueva.

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Verificación recomendada

1. Visitar las seis rutas en escritorio y móvil.
2. Probar búsquedas con y sin tildes, filtros y el estado sin resultados.
3. Validar navegación a perfiles, detalles y enlaces externos válidos.
4. Ejecutar `pnpm build` en un entorno con dependencias y variables configuradas.

Esta entrega no introduce cambios en la base de datos, APIs, admisiones, autenticación ni despliegue.

Conventional Commit: `feat(ui): rediseñar directorios y detalles de equipo, proyectos y publicaciones`
