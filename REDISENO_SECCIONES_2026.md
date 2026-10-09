# SYNAPSE — Rediseño unificado de secciones

## Alcance

Se transformaron las **seis rutas** solicitadas:

- `/equipo` — directorio existente, diseño editorial refinado, métricas, filtros accesibles y enlaces a proyectos/publicaciones.
- `/equipo/[id]` — perfil individual, detalles de cargo y responsabilidades, conexiones al trabajo del semillero, perfiles relacionados y navegación entre integrantes.
- `/proyectos` — hero editorial, métricas calculadas desde JSON, catálogo con búsqueda por título/descripción/tecnología/equipo, filtro por estado y tarjetas de proyecto destacadas.
- `/proyectos/[slug]` — proyecto con metadata, etapas, impacto esperado, equipo, tecnologías y contenido relacionado.
- `/publicaciones` — hero editorial, métricas, catálogo filtrable por formato y búsqueda por título/autor/año.
- `/publicaciones/[id]` — ficha bibliográfica, autoría, medio, recursos externos válidos y contenido relacionado.

## Identidad y componentes

- Tipografías originales: Geist y DM Mono. Paleta: tinta casi negra `#111210`, papel `#f4f2ec`, amarillo ámbar `#f5a800`.
- Nuevos componentes: `ResearchSectionNav`, `ProjectsExplorer`, `PublicationsExplorer`.
- CSS dedicado y encapsulado en `src/styles/research-pages.css`; se importa a nivel de layout para las rutas correspondientes.
- Búsqueda sin sensibilidad a tildes ni mayúsculas y filtros en cliente sin solicitudes de red.
- Diseño responsive y compatibilidad con `prefers-reduced-motion`.
- Los valores `"#"` de los JSON se consideran placeholders: no se presentan como enlaces a recursos publicados.

## Compatibilidad

- Sin nuevas dependencias ni cambios en la API, base de datos, modelos, rutas de acceso, nombres de campos JSON o pantallas fuera del alcance.
- Las rutas dinámicas siguen utilizando `generateStaticParams`, `generateMetadata`, `notFound` y los identificadores existentes.
- Se conservaron los componentes de la portada global (`ProjectCard`, `PublicationCard`) para no alterar `/`.

## Validación

- `node scripts/validate-team.mjs`
- `node --experimental-strip-types --test tests/*.test.mjs`
- `npm run test:research`
- Análisis sintáctico TSX/TypeScript con TypeScript `transpileModule`, CSS con `postcss.parse`.

**Limitación de verificación:** en este entorno el ZIP no incluye `node_modules`, por lo que no se pudo ejecutar `next build` ni realizar QA visual en un navegador. Tras instalar las dependencias en el proyecto real, ejecutar `pnpm install && pnpm build` y comprobar las rutas en móvil/escritorio.

## Conventional Commit

`feat(ui): unificar diseño de equipo, publicaciones y proyectos con catálogos interactivos`
