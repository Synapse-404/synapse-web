# SYNAPSE Web

Sitio web institucional del Semillero de Investigación SYNAPSE de la Fundación Universitaria Claretiana, sede Quibdó. La plataforma comunica la identidad del semillero, su propósito, líneas de trabajo, impacto esperado, equipo y mecanismos de vinculación.

## Sobre SYNAPSE

SYNAPSE es un espacio de formación, investigación e innovación enfocado en el desarrollo de soluciones de software y en la generación de conocimiento que aporte al crecimiento académico y social.

El semillero trabaja desde un enfoque territorial, orientado a transformar realidades locales mediante tecnología, investigación aplicada y análisis de datos.

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
