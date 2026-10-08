# SEO — SYNAPSE

Esta entrega conserva el diseño y añade metadatos técnicos SEO mediante las convenciones de Next.js App Router.

## Configuración obligatoria en producción

Define **SITE_URL** con la URL pública canónica del sitio, sin rutas ni barra final, por ejemplo:

```env
SITE_URL=https://tu-dominio.com
```

No se asignó ningún dominio ficticio. La aplicación usa, por orden: `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL`, y en desarrollo `http://localhost:3000`. **Fuera de Vercel, configura SITE_URL antes de desplegar** para evitar URLs canónicas locales. En Vercel, preferiblemente configura igualmente `SITE_URL` con tu dominio propio para un comportamiento estable.

## Archivos SEO

- `src/app/layout.tsx`: metadatos globales, configuración de indexación, idioma, ícono y JSON-LD de la organización.
- `src/lib/seo.ts`: títulos y descripciones reutilizables, etiquetas canónicas, Open Graph y Twitter Cards.
- `src/app/opengraph-image.png`: imagen social 1200 × 630 creada **a partir de** `public/synapse-brandmark-v3.png` (se conservó el logo original).
- `src/app/twitter-image.png`: imagen equivalente para Twitter/X.
- `src/app/robots.ts`: habilita indexación pública excepto `/api/` y `/tunnel/`; bloquea previsualizaciones Vercel.
- `src/app/sitemap.ts`: indexa las páginas reales y sus detalles de proyectos, publicaciones, blog y equipo.
- Páginas internas: metadatos específicos y URLs canónicas según la ruta; sin modificar el contenido visual.

## Comprobación posterior al despliegue

1. Visita `/robots.txt`, `/sitemap.xml` y las direcciones de imagen que Next.js incluya en las etiquetas `og:image` y `twitter:image` para comprobar la salida.
2. Inspecciona las etiquetas `<meta>` del HTML público y confirma que las URL canónicas apunten a tu dominio real.
3. Registra el sitio en Google Search Console y envía `/sitemap.xml`.
4. Verifica la vista previa al compartir la URL en LinkedIn y WhatsApp. Algunas redes almacenan la imagen anterior en caché.

**Nota:** la indexación depende de los motores de búsqueda y no se garantiza por añadir estos metadatos.
