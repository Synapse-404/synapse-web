# Rediseño SYNAPSE — Octubre 2026

## Qué cambió

- Portada editorial oscura inspirada en la referencia visual facilitada.
- Paleta original preservada: amarillo SYNAPSE (`#F5A800`), negro y neutros claros.
- Tipografía **Geist** para titulares e interfaz, con **DM Mono** en detalles técnicos.
- Video de fondo en reproducción automática, silenciado, en bucle, sin controles y con `playsInline`.
- Versión comprimida de 1,7 MB (`public/metal-human-optimized.mp4`) para la portada. El archivo fuente `public/metal-human.mp4` se conserva intacto.
- Imagen `public/metal-human.jpg` empleada como `poster`, fallback del video y elemento editorial en la sección de identidad.
- Logotipo e imagen cartográfica recortados en nuevos archivos derivados, sin alterar los recursos originales.
- Nuevas secciones y componentes de proyectos, publicaciones, líneas de investigación, bitácora y equipo.
- Páginas de detalle y listados con estilo consistente. Se añade `/blog` y una página `404` propia.
- Navegación móvil accesible, enlaces funcionales y adaptación responsive.
- Configuración visual sensible a `prefers-reduced-motion` (muestra imagen estática).

## Funciones pendientes de backend

El formulario de vinculación original mostraba una confirmación de envío sin persistir ni transmitir datos. Ahora la interfaz indica claramente que **no existe un servicio receptor configurado** y no simula un envío. Para activarlo debe conectarse a un endpoint, proveedor de correo o formulario institucional autorizado, además de incorporar validación del servidor, protección contra spam y aviso de tratamiento de datos.

## Ejecutar

```bash
pnpm install
pnpm dev
```

Para producción:

```bash
pnpm build
pnpm start
```

Las rutas y fuentes de datos JSON existentes se conservan. El proyecto continúa utilizando Next.js App Router.

## Verificaciones realizadas

- Sintaxis TS/TSX analizada sin errores (28 archivos).
- CSS analizado satisfactoriamente con PostCSS.
- Script de validación del equipo: aprobado (14 integrantes).
- Archivo optimizado H.264 validado (1600 × 1196, 10 segundos).

No se pudo ejecutar `pnpm build` en este entorno porque las dependencias del proyecto no estaban instaladas y no había acceso a `registry.npmjs.org`.

## Ajuste del logotipo en header

- El encabezado emplea `public/synapse-header-logo.png`, un recurso transparente derivado del logotipo original.
- Se adaptaron los trazos negros del símbolo a marfil para asegurar contraste sobre el fondo oscuro; los colores de acento originales permanecen.
- Se incrementó su tamaño y se ajustaron los puntos de ruptura para escritorio, tablet y móvil.

## Ajuste definitivo del logotipo del header

- Se sustituyó el uso del logotipo apilado en el header por dos recursos horizontales independientes: `public/synapse-brandmark-v3.png` y `public/synapse-logotype-v3.png`.
- La composición del header conserva el icono y la tipografía propios de SYNAPSE. El descriptor «SEMILLERO DE INVESTIGACIÓN» se renderiza debajo, como texto accesible.
- Se ajustaron las medidas para 320 px, 375 px, tablets y escritorio, con `object-fit: contain` y tamaños diferenciados por breakpoint.
- Se cambiaron los nombres de archivo para evitar confusiones con versiones anteriores almacenadas en caché.
