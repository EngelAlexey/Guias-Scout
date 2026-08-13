# Guia para editar el sitio

Para la persona del Grupo 35 que queda a cargo del sitio cuando termine el TCU.
No hace falta programar ni instalar nada: todo se hace desde el navegador.

La decision de trabajar asi, en vez de construir un panel administrativo, esta
en [`mantenimiento.md`](./mantenimiento.md).

## Antes de empezar

Necesitas una cuenta de GitHub con permiso de escritura en
<https://github.com/EngelAlexey/Guias-Scout>.

Casi todo el texto del sitio vive en **un solo archivo**:

```
messages/es.json
```

Cambiar un texto es cambiar ese archivo. Nada mas.

## Cuatro reglas que no se rompen

1. **No se publican datos inventados.** Si no tenes el dato, se deja el marcador
   «Por confirmar». Es preferible a poner un numero aproximado.
2. **El archivo es JSON y es estricto.** Cada texto va entre comillas dobles y
   cada linea de una lista lleva coma al final, menos la ultima. Si se rompe la
   sintaxis, el sitio no compila. GitHub te avisa con un subrayado rojo.
3. **Nunca se edita `main` directamente.** Los cambios entran por `dev`, pasan a
   `qa` y solo despues a `main`.
4. **Antes de publicar hay visto bueno** de la jefatura de grupo y la
   administracion.

## Como se edita un archivo, paso a paso

1. Entrar a <https://github.com/EngelAlexey/Guias-Scout>.
2. Arriba a la izquierda, donde dice el nombre de la rama, escoger **`dev`**.
3. Abrir la carpeta `messages` y hacer clic en `es.json`.
4. Hacer clic en el lapiz (**Edit this file**), arriba a la derecha.
5. Buscar el texto con `Ctrl+F` y cambiarlo.
6. Bajar hasta **Commit changes**.
7. Escribir en una linea que cambiaste. Ejemplo: `Actualizar telefono del grupo`.
8. Escoger **Create a new branch for this commit and start a pull request**.
9. Clic en **Propose changes** y despues en **Create pull request**.
10. Avisarle a alguien del equipo tecnico para que lo revise y lo integre.

Si algo sale mal, no pasa nada: mientras el pull request no se integre, el sitio
publicado no cambia.

## Donde esta cada cosa

| Lo que queres cambiar          | Buscar esta clave en `messages/es.json` | Se ve en           |
| ------------------------------ | --------------------------------------- | ------------------ |
| Telefono, direccion, horario   | `content.contact`                       | Todo el sitio      |
| Actividades proximas           | `content.agenda`                        | Portada            |
| Equipo de personas adultas     | `content.team`                          | `/es/about`        |
| Historia del grupo             | `about.history`                         | `/es/about`        |
| Valores                        | `content.values`                        | `/es/about`        |
| Datos de las cuatro secciones  | `content.sections`                      | `/es/sections`     |
| Costo, edad, inscripciones     | `join.facts`                            | `/es/join`         |
| Numeros de impacto             | `impact.axes`                           | `/es/impact`       |
| Proyectos                      | `projects.items`                        | `/es/projects`     |
| Comunicados y avisos           | `news.items`                            | `/es/news`         |

El contacto vive **una sola vez** en `content.contact`. Cambiarlo ahi lo cambia
en las tres paginas donde aparece: no hay que buscarlo en varios lugares.

## Recetas

### Cambiar el telefono, la direccion o el horario

Buscar `"contact"` y editar el valor que corresponda:

```json
"contact": {
  "address": "Plaza de Tierra, Esparzol, Esparza, Puntarenas.",
  "addressShort": "Esparza, Esparzol, Plaza de Tierra",
  "meetings": "Todos los domingos, de 10 de la mañana a 12 mediodía.",
  "meetingsNote": "No hay reuniones desde el 15 de diciembre hasta inicios de enero.",
  "phone": "6010 1502",
  "phoneNote": "Responde la jefatura de grupo."
}
```

**Ojo con el telefono:** el numero que se ve esta en `phone`, pero el enlace en
el que se hace clic esta en otro archivo, `lib/content/site.ts`, como
`phoneHref: "tel:+50660101502"`. Si cambia el numero hay que cambiar **los dos**.
Ese segundo cambio pedilo al equipo tecnico.

### Publicar un comunicado

Buscar `"news"` y despues `"items": []`. Esa lista arranca vacia. Un comunicado
se agrega asi:

```json
"items": [
  {
    "date": "12 de agosto de 2026",
    "section": "Tropa",
    "title": "Lista de qué llevar al campamento",
    "body": "Bolsa de dormir, aislante, linterna y ropa de abrigo. Salimos el viernes a las 5 de la tarde desde la sede."
  }
]
```

- `date` es texto libre: se muestra tal cual como lo escribas.
- `section` es opcional. Si el aviso es para todo el grupo, borra esa linea
  completa (incluida la coma del final).
- Para agregar un segundo comunicado, se copia el bloque entre `{` y `}`, se
  pone una coma entre los dos y se deja el mas nuevo de primero.
- Para quitar un comunicado viejo, se borra su bloque completo.

Cuando la lista queda vacia la pagina muestra sola el mensaje de «Todavia no hay
comunicados publicados». No hay que hacer nada mas.

### Agregar o quitar una actividad de la agenda

Buscar `"agenda"` dentro de `content`:

```json
"agenda": [
  {
    "day": "30",
    "month": "SET",
    "title": "Desfile de Bandas en Puntarenas",
    "detail": "30 de setiembre de 2026 · Todas las secciones · Puntarenas centro · En horas de la mañana."
  }
]
```

`day` y `month` son lo que se ve en el cuadrito de fecha; `detail` es la linea
larga de abajo. Si solo se sabe el mes, se escribe como en las otras entradas:
`"day": "Dic"`, `"month": "2026"`, y en `detail` «dia por confirmar».

> **Aviso importante.** Hay una lista tecnica en `lib/content/site.ts` llamada
> `AGENDA_TONES` que le da el color a cada actividad y **tiene que tener
> exactamente la misma cantidad de entradas que `content.agenda`**. Si agregas o
> quitas una actividad, hay que tocar tambien esa lista. TypeScript no lo
> detecta y la pagina se rompe en el navegador. **Este cambio pedilo siempre al
> equipo tecnico.**

**La agenda no se limpia sola.** El sitio es estatico y no sabe que dia es hoy:
una actividad de setiembre de 2026 se sigue mostrando en 2027. Hay que revisar
la lista antes de cada publicacion. Lo mismo pasa con «Proximas inscripciones:
Octubre de 2026» en `join.facts`.

### Agregar una persona al equipo

Buscar `"team"` dentro de `content`:

```json
{
  "initials": "EM",
  "name": "Elena Manzanarez Juárez",
  "role": "Jefe de grupo · Gestión",
  "detail": "Técnica universitaria en gestión local y políticas públicas."
}
```

`initials` son las iniciales que se ven en el circulo de color: el grupo pidio
**no publicar fotos** del equipo, asi que las tarjetas usan iniciales.

> **Mismo aviso que la agenda.** `TEAM_SECTIONS` en `lib/content/site.ts` debe
> tener la misma cantidad de entradas que `content.team`. Pedilo al equipo
> tecnico junto con el cambio.

Cuando esten publicadas las 22 personas, se puede borrar la nota amarilla de esa
seccion: es la clave `about.team.rosterNote`.

### Llenar los numeros de Impacto

Buscar `"axes"` dentro de `impact`. Cada dato tiene una etiqueta y, cuando
llegue el dato, se le agrega un valor:

```json
{ "label": "Presentaciones realizadas", "value": "14" }
```

Mientras el `value` no exista, la pagina muestra sola la etiqueta «Por
confirmar». **Agregar `value` es lo unico que hace falta** para publicar el
numero: no hay que tocar la pagina.

Lo mismo funciona en `content.sections`, donde faltan dos datos de Comunidad.

### Quitar un «Por confirmar»

Hay dos tipos de marcador:

- **En un dato suelto** (los cuadritos de numeros y las fichas de seccion): se
  quita **agregando el `value`**, como en el ejemplo de arriba.
- **En un bloque entero** (la nota amarilla con icono): son textos como
  `about.team.rosterNote`. Se quita cuando el bloque ya no tiene huecos, y ese
  cambio si toca la pagina: pedilo al equipo tecnico.

La lista completa de lo que falta esta en
[`contenido-pendiente.md`](./contenido-pendiente.md).

### Activar los formularios de inscripcion y voluntariado

Los dos formularios de `/es/join` ya estan construidos. Al enviarlos se abre el
correo de la persona con el mensaje ya redactado hacia el grupo.

El interruptor es `FORM_RECIPIENT` en `lib/content/site.ts`. Hoy tiene un correo
de prueba (`prueba@grupo35.example`) y hay que reemplazarlo por el correo
institucional real apenas exista. Eso es el issue #67 y lo hace el equipo
tecnico.

Si `FORM_RECIPIENT` queda vacio, la pagina muestra sola un aviso y no publica
formularios muertos.

## Como se publica

El sitio tiene tres ramas y los cambios van siempre en el mismo orden:

```
dev  ->  qa  ->  main
```

- **`dev`**: donde entra todo cambio nuevo.
- **`qa`**: se revisa que se vea bien.
- **`main`**: lo que ve el publico.

Un cambio de contenido nunca salta directo a `main`. Y antes de que llegue ahi,
la jefatura de grupo y la administracion dan el visto bueno.

## Revision antes de cada publicacion

- [ ] Las actividades de `content.agenda` todavia no pasaron.
- [ ] La fecha de `join.facts` («Proximas inscripciones») sigue vigente.
- [ ] Los comunicados viejos que ya no aplican estan borrados.
- [ ] Ningun dato nuevo se invento: todo salio de la jefatura.
- [ ] La jefatura y la administracion dieron el visto bueno.

## Cuando pedir ayuda al equipo tecnico

Todo lo demas se puede hacer desde el navegador. Estas cosas no:

- Agregar o quitar entradas de **agenda** o de **equipo** (las listas paralelas
  `AGENDA_TONES` y `TEAM_SECTIONS`).
- Cambiar el **enlace** del telefono (`phoneHref`).
- Activar los **formularios** (`FORM_RECIPIENT`).
- Quitar una **nota amarilla** de bloque completo.
- Cambiar **fotos**, colores o cualquier cosa de como se ve el sitio.
- Cualquier cosa donde el sitio deje de compilar.

## A quien preguntarle

- **Contenido y datos del grupo:** Elena Manzanarez Juarez.
- **Visto bueno para publicar:** jefatura de grupo y administracion.
- **Lo tecnico:** Comunicacion y Tecnologia del grupo. El nombre exacto de esa
  persona esta por confirmar; se anota en
  [`mantenimiento.md`](./mantenimiento.md) apenas el grupo responda.
