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


## Túnel 3D inmersivo — nueva integración (2026-10-08)

- Componente: `src/components/TunnelJourney.tsx`.
- Animación autónoma Three.js r0.143.0: `public/tunnel/index.html`.
- Estilos: `src/styles/tunnel.css`.
- Insertado **entre Nuestra identidad y Proyectos** para conservar portada con video, páginas internas, proyectos, publicaciones, bitácora, equipo y formulario.
- El recorrido de 4 capítulos usa el scroll local de la sección; no interfiere con la navegación del documento ni añade una segunda barra de desplazamiento.
- El iframe usa `pointer-events: none`; el cursor del documento y la progresión se transmiten vía `postMessage` verificando origen.
- Carga diferida cuando el usuario se aproxima, pausa fuera de pantalla y en pestañas ocultas, evita ejecutar WebGL si `prefers-reduced-motion: reduce` y tiene respaldo CSS ante errores/corte de CDN.
- Los shaders, puntos, bloom y parámetros originales del brief se conservaron; la resolución de render se limita en dispositivos móviles para evitar consumo excesivo de GPU. Los colores del túnel mantienen el cian y violeta originales; la capa editorial utiliza el ámbar de SYNAPSE.
- **Conectividad**: la escena se sirve en HTML local, pero sus módulos Three.js se obtienen de `unpkg.com` mediante importmap. Para despliegues sin acceso a internet se recomienda empaquetar esas dependencias localmente.
- Para visualizar la animación aislada: `/tunnel/index.html` (también funciona con scroll propio).
- Conventional Commit: `feat(ui): integrar túnel 3D inmersivo con recorrido interactivo en SYNAPSE`.
