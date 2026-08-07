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
| `/es/impact`        | Impacto con datos abiertos del grupo                    |
| `/es/projects`      | Proyectos, empezando por la Banda                       |
| `/es/news`          | Comunicados para las familias                           |
| `/es/design-system` | Guia de estilo viva para el resto del equipo            |

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

- `NEXT_PUBLIC_SITE_URL`: dominio publico del sitio. De ahi salen `metadataBase`, el sitemap y `robots.txt`. Si queda vacia se usa `http://localhost:3000`, asi que hay que definirla antes de publicar.
- `NEXT_PUBLIC_SUPABASE_URL`: URL publica del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: llave publica anonima del proyecto Supabase.

Las variables de Supabase pueden quedar vacias mientras solo se trabaje en la base del repositorio. La app no implementa todavia autenticacion, tablas, politicas RLS ni almacenamiento final.

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

Estan implementadas Inicio, Nuestro Grupo, Secciones, Unete, Impacto, Proyectos y Comunicados con contenido estatico servido desde el diccionario de i18n. Los numeros de Impacto y el catalogo de Proyectos se completan con datos verificables del grupo a medida que la jefatura los confirma (ver `docs/contenido-pendiente.md`). Siguen pendientes: el formulario de voluntariado, el panel administrativo, la galeria, la autenticacion y la carga de imagenes.

Las fotos de referencia se sirven desde Unsplash mientras no exista el banco de imagenes propio en Supabase Storage. El logo es el emblema de la Asociacion de Guias y Scouts de Costa Rica (`public/logo.webp`).
