# SYNAPSE — Corrección del entorno de compilación en Vercel

## Problema observado
`ERR_PNPM_META_FETCH_FAIL` / `ERR_INVALID_THIS`: fallo al descargar paquetes durante `pnpm install`.
No se origina en Tailwind ni en la aplicación Next.js.

## Cambios incluidos
- `package.json`: fija `packageManager` en `pnpm@10.26.0`.
- `package.json`: fija `engines.node` en `22.x` para el build de Vercel.
- `yarn.lock`: retirado; el único lockfile mantenido es `pnpm-lock.yaml`.
- Sin cambios en dependencias, fuentes, variables de entorno, Prisma o rutas.

## Configurar en Vercel
1. Project > Settings > Environment Variables:
   `ENABLE_EXPERIMENTAL_COREPACK=1` (Production, Preview y Development, si aplica).
   No publiques credenciales en el repositorio.
2. Project > Settings > Build and Deployment (o General): Node.js Version `22.x`.
3. Build & Development Settings: desactiva *Install Command Override*, si estaba activado.
4. Asegura que la Root Directory apunta a la carpeta que contiene `package.json`.
5. Vuelve a desplegar con la opción sin caché de compilación si existe.

## Verificación local
```sh
corepack enable
corepack prepare pnpm@10.26.0 --activate
pnpm --version
pnpm install --frozen-lockfile
pnpm run build
```

## Si persiste el mismo ERR_INVALID_THIS
- Verifica el pnpm y Node efectivamente usados en las primeras líneas de los Build Logs.
- Comprueba si hay incidentes de conectividad Vercel ↔ npm Registry.
- Como el problema está en instalación remota, no es posible garantizar que se resuelva sólo con cambios al código.
- Contrasta la variable `ENABLE_EXPERIMENTAL_COREPACK`: algunos incidentes del proveedor reportaron mejoras al activarla, otros al desactivarla. Una vez fijado `packageManager`, prueba el valor `1` primero.

## Fuentes de referencia
- https://vercel.com/docs/package-managers
- https://vercel.com/docs/builds/configure-a-build
- https://community.vercel.com/t/pnpm-install-failing/30122
