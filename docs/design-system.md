# Base de diseno del sitio

Origen: proyecto de Claude Design "Sitio web Grupo 35 Scouts", archivo
`Sitio Grupo 35.dc.html`. Ese prototipo usaba una sola pantalla con estado
interno; aqui se implemento como rutas reales del App Router.

La pagina viva de esta guia es `/es/design-system`.

## Donde vive cada cosa

| Que                                     | Donde                          |
| --------------------------------------- | ------------------------------ |
| Tokens (color, ritmo, tipografia) y CSS | `app/globals.css`              |
| Textos visibles (todos)                 | `messages/<locale>.json`       |
| Datos estructurales (ids, rutas, hex)   | `lib/content/site.ts`          |
| Configuracion de idiomas y navegacion   | `i18n/`                        |
| Resolucion de idioma por peticion       | `proxy.ts`                     |
| Encabezado, pie, marca, iconos          | `components/`                  |
| Una pagina por pantalla                 | `app/[locale]/<ruta>/page.tsx` |
| Logo                                    | `public/logo.webp`             |

Dos reglas que no se rompen:

- No se escriben colores hexadecimales sueltos dentro de los componentes: todo
  sale de custom properties.
- No se escribe texto visible dentro del JSX: todo sale de llaves de i18n.

## Idiomas (i18n)

El sitio usa **next-intl** con el idioma en la URL: `/es`, `/es/about`, etc.
`proxy.ts` redirige `/` a `/es` y resuelve el idioma de cada peticion.

| Archivo             | Que hace                                                |
| ------------------- | ------------------------------------------------------- |
| `i18n/routing.ts`   | Lista de idiomas y cual es el predeterminado            |
| `i18n/navigation.ts`| `Link`, `usePathname`, `redirect`... con idioma incluido |
| `i18n/request.ts`   | Carga el archivo de mensajes que corresponde            |
| `messages/es.json`  | Todos los textos en espanol, con tildes                 |

En paginas y componentes de servidor se usa `getTranslations`; en componentes
de cliente, `useTranslations`. Para listas se usa `t.raw("content.values")`,
y para texto con formato `t.rich(...)` con las etiquetas permitidas
(`code`, `b`, `br`).

**Importante:** los `href` se escriben sin prefijo (`/about`) y se importa
`Link` desde `@/i18n/navigation`, no desde `next/link`. El prefijo lo agrega
el helper.

### Agregar un idioma

1. Copiar `messages/es.json` a `messages/en.json` y traducir los valores.
2. Agregar el codigo a `locales` en `i18n/routing.ts`.

No hay que tocar ninguna pagina: las rutas ya viajan con idioma y el sitemap
genera las alternativas `hreflang` solo.

## Rutas

| Ruta                 | Estado                                       |
| -------------------- | -------------------------------------------- |
| `/es`                | Inicio                                       |
| `/es/about`          | Nuestro Grupo                                |
| `/es/sections`       | Manada, Tropa, Wak y Comunidad               |
| `/es/join`           | Como inscribirse y contacto                  |
| `/es/impact`         | Impacto con datos abiertos del grupo         |
| `/es/projects`       | Proyectos, empezando por la Banda            |
| `/es/news`           | Comunicados para las familias                |
| `/es/design-system`  | Esta guia, en vivo                           |

Las carpetas van en ingles porque en el App Router la carpeta es el segmento
de URL, y las URL en ingles son la practica comun aunque el contenido este en
espanol. Los nombres visibles de cada seccion salen de `messages/`.

## Color

| Token                | Valor     | Uso                        |
| -------------------- | --------- | -------------------------- |
| `--ink`              | `#2E1A47` | Fondos oscuros y titulos   |
| `--purple`           | `#5B2D8E` | Accion primaria y enlaces  |
| `--amber`            | `#F2A900` | Destacados y llamados      |
| `--green` / `--green-deep` | `#2E7D4F` / `#1F6E44` | Eje ambiental |
| `--cream`            | `#FAF8F3` | Fondo general              |
| `--text`             | `#5B5169` | Parrafos                   |
| `--muted`            | `#675A80` | Etiquetas pequenas         |

Respecto al prototipo se oscurecieron tres valores para que el texto pequeno
cumpla contraste AA: `#B8860B` -> `#8A6508`, `#8A7CA0` -> `#675A80` y
`#8E7CAC` -> `#9C8BBB` (este ultimo sobre fondo oscuro).

### Color por seccion

Poner `data-seccion="manada" | "tropa" | "wak" | "comunidad"` en cualquier
contenedor reescribe `--acento`, `--acento-fuerte`, `--acento-suave` y
`--acento-texto` para todo lo que quede adentro. Asi la misma tarjeta o el
mismo `.icon-badge` sirve para las cuatro secciones sin duplicar clases.

El atributo sigue en espanol a proposito: es la llave que une el CSS con los
ids de seccion, y renombrarlo obligaria a reescribir toda la hoja de estilos.

## Marca

El logo es el emblema de la Asociacion de Guias y Scouts de Costa Rica
(`public/logo.webp`, 960x1067, con transparencia). Lo dibuja un unico
componente, `components/brand-mark.tsx`:

- `height` fija el alto y el ancho se deriva de la proporcion real.
- `onDark` envuelve el emblema en una pastilla clara, porque la flor de lis es
  azul marino y sobre el pie oscuro perderia contraste.

Si algun dia cambia el archivo, se cambia ahi y en ningun otro lugar.

## Tipografia

Sora para titulos (700/800) y Mulish para texto, cargadas con `next/font/google`
y auto-hospedadas: no hay peticion a Google en tiempo de ejecucion ni salto de
maquetacion. Se exponen como `--font-titulo` y `--font-texto`.

Los tamanos son fluidos (`clamp`), asi que el prototipo de 1280px se lee igual
de bien en 360px sin escalones bruscos.

## Ritmo

- Ancho maximo `1280px` (`--ancho`), margenes `clamp(20px, 5vw, 32px)`.
- Separacion entre secciones `clamp(56px, 8vw, 84px)`.
- Espacio entre columnas `clamp(36px, 5vw, 64px)`.
- Radio: tarjeta `20px`, imagen `24px`, boton `999px`.

## Movimiento y compas

El sitio se movia con tres transiciones sueltas de `0.18s` que no
significaban nada. Ahora hay un solo tempo, y sale del sujeto: una banda
marcha a **120 pasos por minuto**, o sea una negra cada **500 ms**. Todo el
movimiento del sitio es una subdivision de ese pulso.

| Token             | Valor   | Para que                        |
| ----------------- | ------- | ------------------------------- |
| `--contra`        | `125ms` | cambios de color                |
| `--medio-pulso`   | `250ms` | masa: `transform`, `box-shadow` |
| `--pulso`         | `500ms` | la negra. Nada dura mas         |
| `--ease-suave`    | —       | salida rapida, aterrizaje asentado |
| `--ease-salida`   | —       | entradas                        |

Regla, sin excepciones: **el color cambia en la contra, la masa se mueve en
el medio pulso, y nada dura mas de un pulso.**

**El compas** es la firma del sitio. Cada costura entre bloques
(`.section + .section::before`) lleva una franja de 12px con pulsos debiles
cada `--compas-pulso` y, cada cuatro pulsos, un tiempo fuerte a altura
completa. Los tiempos fuertes son los cuatro colores de seccion en el orden
de la progresion por edades: manada, tropa, wak, comunidad. El compas del
sitio es el recorrido del grupo. Son dos gradientes: cero imagenes, cero
JavaScript. Sobre fondo oscuro se reescribe solo `--compas-debil`.

La barra de `.seccion-card` se queda **solida**, en el color de su seccion. Se
probo con el pulso grabado encima y se leia como ruido: el compas vive en las
costuras entre bloques y no se repite dentro de cada tarjeta. El hover
responde con la tarjeta entera, que sube y estrena sombra. Las tarjetas que no
llevan a ningun lado no se mueven: el hover es una promesa.

**Frecuencia.** El compas no sella todas las costuras: entre dos secciones
claras seguidas no hay cambio de registro y el riel se volveria papel tapiz.
Marca el cierre del bloque de apertura y las entradas y salidas de una banda
de color (`--ink`, `--green`, `--lilac`). En la portada son tres, nunca dos
seguidas.

El compas que cierra la portada se traza solo de izquierda a derecha, una vez,
con easing **lineal** — es lo unico lineal del sitio, porque una formacion que
avanza por la calle no acelera ni frena.

Reglas de seguridad:

- El estado oculto de la entrada y del revelado por scroll vive **dentro** de
  `@media (prefers-reduced-motion: no-preference)`. Con movimiento reducido no
  se declara nada: el contenido se ve como siempre y el compas queda dibujado.
- El revelado por scroll usa `animation-timeline: view()` detras de un
  `@supports`. Donde no exista, el bloque entero no aplica.
- `.hero__title` es el elemento LCP: se desplaza pero **nunca** baja su
  opacidad. Retrasar su pintado seria pagar rendimiento por adorno.

## Clases principales

- Estructura: `.section` + modificadores `--cream|--white|--ink|--green|--lilac`,
  `.container`, `.split`, `.card-grid--3|--4`.
- Texto: `.eyebrow`, `.title-xl|lg|md|sm`, `.lead`, `.prose`.
- Acciones: `.btn`, `.btn--accent`, `.btn--ghost`, `.btn--outline-dark`,
  `.btn--light`, `.link-arrow`.
- Piezas: `.card`, `.icon-badge`, `.chip`, `.tag-seccion`, `.fact`, `.metric`,
  `.avatar`, `.team-card__*`, `.agenda-item`, `.agenda-fecha` (con
  `data-tono="green|amber"`).
- Formularios (`.form`, `.form__row`, `.field`, `.field__label`,
  `.field__control`, `.checkbox-row`, `.form__note`, `.form__actions`):
  campos con borde `--line`, radio 12px y foco con anillo de `--acento-suave`.
  El estado invalido usa `:user-invalid` con `--error`/`--error-suave`, sin
  JavaScript.

`.card-grid` sin modificador es una sola columna con `gap: 22px`: es el
contenedor de la agenda en la portada. `.fact-grid` es de dos columnas y sirve
tanto para los hechos de cada seccion como para los hitos de la historia y los
datos de inscripcion.

Siguen reservados, escritos y sin usar: `.social-row`, `.social-link` y
`.footer-mail` junto con `SOCIAL_ICONS` (`components/icons.tsx`). Esperan a que
el grupo entregue correo y redes sociales. Ojo con `.footer-mail`: el `a:hover`
global lo pisaba, por eso tiene su propia regla de hover.

Los nombres de clase siguen en espanol. Es la unica capa que no se tradujo,
para no tocar 1800 lineas de CSS por un cambio cosmetico.

## Puntos de quiebre

| Ancho    | Que cambia                                                    |
| -------- | ------------------------------------------------------------- |
| `1080px` | Rejillas de 4 columnas pasan a 2; pie a 2 columnas            |
| `980px`  | Menu principal pasa a boton hamburguesa                       |
| `900px`  | Bloques de dos columnas se apilan; la tabla pasa a tarjetas    |
| `620px`  | Todo a una columna; botones a ancho completo                  |

## Accesibilidad

- Enlace "Saltar al contenido" antes del encabezado (`#content`).
- Navegacion con enlaces reales y `aria-current="page"` en la ruta activa.
- Foco visible con `:focus-visible` (contorno ambar de 3px).
- La tabla comparativa mantiene `<th scope="col">` y en movil expone el
  encabezado de cada celda con `data-label`.
- Se respeta `prefers-reduced-motion`.
- `<html lang>` se sincroniza con el idioma activo.

## Como agregar una pagina

1. Crear `app/[locale]/<ruta>/page.tsx` con la carpeta en ingles.
2. Recibir `params: Promise<{ locale: string }>`, llamar a
   `setRequestLocale(locale)` y exportar `generateMetadata`.
3. Envolver cada bloque en `<section className="section section--cream">` con
   un `<div className="container">` adentro.
4. Escribir los textos en `messages/es.json` y leerlos con `getTranslations`.
5. Importar `Link` desde `@/i18n/navigation`.
6. Si la pagina ya es publica, agregarla a `app/sitemap.ts` y quitarla de
   `PRIVATE_ROUTES` en `app/robots.ts`.

## Pendiente (segunda mitad del proyecto)

`/es/impact`, `/es/projects` y `/es/news` ya son paginas reales sobre la misma
base de diseno. Los numeros de Impacto se completan con el informe social del
grupo y el catalogo de Proyectos con lo que la jefatura confirme; hasta
entonces se muestran marcadores de «por confirmar».

`/es/join` tiene los dos formularios (inscripcion y voluntariado) ya
construidos en `components/recruitment-forms.tsx`. Envían al endpoint privado
`POST /api/recruitment`, que valida y almacena las solicitudes en Supabase. La
configuración y la migración viven en `docs/supabase.md`.
