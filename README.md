# Grupo 35 de Guias y Scouts

Sitio web del proyecto TCU asociado al Grupo 35 de Guias y Scouts. El frontend esta construido con Next.js y Supabase queda preparado como backend previsto para autenticacion, base de datos, almacenamiento de imagenes y futuras metricas ambientales.

## Paginas

Las rutas llevan el idioma adelante: `/` redirige a `/es`.

| Ruta                | Estado                                                  |
| ------------------- | ------------------------------------------------------- |
| `/es`               | Inicio                                                  |
| `/es/about`         | Nuestro Grupo (historia, mision, Promesa y Ley, equipo) |
| `/es/sections`      | Manada, Tropa, Wak y Comunidad                          |
| `/es/join`          | Como inscribirse y contacto                             |
| `/es/design-system` | Guia de estilo viva para el resto del equipo            |
| `/es/impact`, `/es/projects`, `/es/news` | Placeholder: segunda mitad del proyecto |

El diseno se documenta en [`docs/design-system.md`](docs/design-system.md).

## Textos e idiomas

Ningun texto visible se escribe en el JSX. Todo vive en `messages/es.json` y se
lee con llaves de i18n (**next-intl**), de modo que traducir el sitio no obliga
a tocar las vistas.

- `messages/<locale>.json`: textos.
- `i18n/`: idiomas disponibles y navegacion con idioma incluido.
- `lib/content/site.ts`: solo datos estructurales (ids, rutas, hex, imagenes).
- `proxy.ts`: resuelve el idioma de cada peticion.

Para agregar un idioma: copiar `messages/es.json`, traducirlo y sumar el codigo
a `locales` en `i18n/routing.ts`. No hay que modificar ninguna pagina.

Al escribir paginas nuevas hay que importar `Link` desde `@/i18n/navigation`
(no desde `next/link`) y escribir los `href` sin prefijo: `/about`, no `/es/about`.

## Stack

- Next.js con App Router
- TypeScript
- next-intl
- Supabase
- pnpm

## Requisitos locales

- Node.js 20 LTS o superior
- pnpm 11 o superior
- Proyecto de Supabase creado cuando se habiliten los modulos que lo necesiten

## Instalacion

```bash
pnpm install
```

## Variables de entorno

Crear un archivo `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

En PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Variables previstas:

- `NEXT_PUBLIC_SUPABASE_URL`: URL publica del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: llave publica anonima del proyecto Supabase.

Estas variables pueden quedar vacias mientras solo se trabaje en la base del repositorio. La app no implementa todavia autenticacion, tablas, politicas RLS ni almacenamiento final.

## Desarrollo

```bash
pnpm dev
```

La aplicacion queda disponible por defecto en `http://localhost:3000`.

## Validacion

```bash
pnpm build
pnpm typecheck
```

## Flujo de ramas

Este proyecto usa tres ramas principales:

- `main`: version estable/publicable.
- `qa`: validacion funcional antes de produccion.
- `dev`: base para desarrollo activo.

No se debe trabajar directamente sobre `main`. Las tareas nuevas salen desde `dev`, se integran primero a `dev`, pasan a `qa` para validacion y solo llegan a `main` cuando esten aprobadas.

Si el repositorio aun no tiene las ramas creadas, se pueden crear despues del primer commit:

```bash
git switch main
git switch -c dev
git switch main
git switch -c qa
git switch main
```

## Estado actual

Estan implementadas las pantallas de la primera mitad del proyecto colaborativo (encabezado, pie, base de diseno, Inicio, Nuestro Grupo, Secciones y Unete) con contenido estatico servido desde el diccionario de i18n. Siguen pendientes: Impacto con datos abiertos, Proyectos, Comunicados, el formulario de voluntariado, el panel administrativo, la galeria, la autenticacion y la carga de imagenes.

Las fotos de referencia se sirven desde Unsplash mientras no exista el banco de imagenes propio en Supabase Storage. El logo es el emblema de la Asociacion de Guias y Scouts de Costa Rica (`public/logo.webp`).
