# Grupo 35 de Guias y Scouts

Sitio web del proyecto TCU asociado al Grupo 35 de Guias y Scouts. El frontend esta construido con Next.js y Supabase funciona como base de datos y backend serverless, incluyendo comprobantes de reclutamiento enviados mediante una Edge Function y Resend.

## Paginas

Las rutas llevan el idioma adelante: `/` redirige a `/es`, el idioma
predeterminado, y cada pagina tambien esta disponible bajo `/en`.

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

Las mismas rutas se publican en ingles sustituyendo `/es` por `/en`. El
selector de idioma de la cabecera conserva la pagina actual al cambiar y esta
disponible tanto en escritorio como dentro del menu movil.

El diseno se documenta en [`docs/design-system.md`](docs/design-system.md).

## Documentacion

| Archivo | Para que sirve |
| ------- | -------------- |
| [`docs/README.md`](docs/README.md) | Índice operativo y guía completa de formularios, Supabase y correos de prueba |
| [`docs/technical-rules.md`](docs/technical-rules.md) | Reglas de ramas, convenciones y validacion |
| [`docs/design-system.md`](docs/design-system.md) | Color, tipografia, componentes y ritmo |
| [`docs/contenido-pendiente.md`](docs/contenido-pendiente.md) | Que datos faltan y quien los aporta |
| [`docs/mapeo-respuestas.md`](docs/mapeo-respuestas.md) | Cada respuesta del grupo y donde quedo en el codigo |
| [`docs/mantenimiento.md`](docs/mantenimiento.md) | Quien mantiene el sitio al terminar el TCU y por que sin panel administrativo |
| [`docs/guia-de-edicion.md`](docs/guia-de-edicion.md) | Guia para el grupo: editar el contenido sin programar |
| [`docs/supabase.md`](docs/supabase.md) | Backend: tablas, permisos, migraciones y acceso al portal |
| [`docs/project-proposal.md`](docs/project-proposal.md) | Propuesta y alcance del TCU |

## Textos e idiomas

Ningun texto visible se escribe en el JSX. Los catalogos viven en
`messages/es.json` y `messages/en.json` y se leen con llaves de i18n
(**next-intl**), de modo que mantener los idiomas no obliga a duplicar vistas.

- `messages/<locale>.json`: textos.
- `i18n/`: idiomas disponibles y navegacion con idioma incluido.
- `lib/content/site.ts`: solo datos estructurales (ids, rutas, hex, imagenes).
- `proxy.ts`: resuelve el idioma de cada peticion.

Espanol e ingles estan habilitados en `i18n/routing.ts`. Para agregar otro
idioma: copiar uno de los catalogos, traducir sus valores y sumar el codigo a
`locales`. No hay que modificar ninguna pagina.

Al escribir paginas nuevas hay que importar `Link` desde `@/i18n/navigation`
(no desde `next/link`) y escribir los `href` sin prefijo: `/about`, no `/es/about`.

## Stack

- Next.js con App Router
- TypeScript
- next-intl
- Supabase Database y Edge Functions
- Resend para correo transaccional
- pnpm

## Requisitos locales

- Node.js 22.13 o superior
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
- `SUPABASE_URL`: URL del proyecto usada por el backend.
- `SUPABASE_SECRET_KEY`: clave secreta usada exclusivamente por el backend para guardar formularios. Nunca debe usar el prefijo `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: URL y clave publicable. El portal de encargados usa la clave publicable desde el servidor para comprobar la clave de acceso contra Supabase Auth.
- `PORTAL_SESSION_SECRET`: cadena aleatoria de al menos 32 caracteres con la que se firma la cookie de sesion del portal. Cambiarla cierra todas las sesiones abiertas.

Para activar los formularios, sus notificaciones y el portal de encargados se
deben ejecutar las migraciones y desplegar la Edge Function según
[`docs/supabase.md`](docs/supabase.md).

## Desarrollo

```bash
pnpm dev
```

La aplicacion queda disponible por defecto en `http://localhost:3000`.

## Validacion

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

`pnpm test` valida las llaves dinámicas de i18n y que los arreglos estructurales
`SDG`, `TEAM_SECTIONS` y `AGENDA_TONES` permanezcan alineados con ambos
catalogos. Tambien comprueba la paridad de llaves, marcadores pendientes,
placeholders y alternativas `hreflang` entre espanol e ingles.

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

Estan implementadas Inicio, Nuestro Grupo, Secciones, Unete, Impacto, Proyectos y Comunicados. Los formularios de inscripción y voluntariado guardan sus solicitudes privadas en Supabase y encolan un comprobante para el correo de quien completa el formulario mediante una Edge Function y Resend. Los numeros de Impacto y el catalogo de Proyectos se completan con datos verificables del grupo a medida que la jefatura los confirma (ver `docs/contenido-pendiente.md`). Siguen pendientes: la galeria, la autenticacion y la carga de imagenes.

El **panel administrativo queda fuera del TCU** por decision explicita: el mantenimiento posterior se resuelve con documentacion y capacitacion. Ver [`docs/mantenimiento.md`](docs/mantenimiento.md).

Las fotos de referencia se sirven desde Unsplash mientras no exista el banco de imagenes propio en Supabase Storage. El logo es el emblema de la Asociacion de Guias y Scouts de Costa Rica (`public/logo.webp`).
