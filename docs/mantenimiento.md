# Mantenimiento del sitio al terminar el TCU

Registro de decision. Cierra la pregunta 10.3 del formulario y el issue #51.

**Estado:** decidido.
**Alcance:** que pasa con el sitio cuando el equipo de TCU se retira.

## Contexto

La respuesta 10.3 dice que el sitio queda a cargo de **Comunicacion y
Tecnologia** del Grupo 35. Quien recibe el proyecto no necesariamente programa.

Hoy todo el contenido publicado vive en `messages/es.json`, `messages/en.json`
y en dos constantes de `lib/content/site.ts`. Cambiar un dato exige mantener
ambos catalogos alineados, hacer un commit y promover la rama. Eso funciona para
quien programa; no para quien reciba el proyecto.

El formulario ofrecia dos salidas y habia que escoger una:

1. **Panel administrativo** con Supabase y autenticacion.
2. **Documentacion y capacitacion** para editar el repositorio.

## Decision

Se adopta la opcion 2: **documentacion y capacitacion**. El panel administrativo
**no se construye dentro del TCU**.

La guia practica que produce esta decision es
[`guia-de-edicion.md`](./guia-de-edicion.md): esta escrita para una persona sin
conocimientos tecnicos, se hace todo desde el navegador y no exige instalar
nada.

## Por que

- **Volumen real de cambios.** Lo que caduca solo son cuatro actividades de
  agenda, una fecha de inscripcion y una lista de comunicados vacia. Un CRUD
  completo con auth y RLS es desproporcionado para ese volumen.
- **Superficie de ataque.** Un panel administrativo agrega login, sesiones,
  politicas RLS y un bucket de imagenes que hay que mantener. Hoy el sitio es
  estatico y no tiene nada que comprometer.
- **Costo.** El grupo no tiene servicio pagado ni dominio propio (1.9 y 10.4).
  Un panel obliga a sostener un proyecto de Supabase activo de forma indefinida.
- **Alcance del TCU.** `project-proposal.md` ya lista el panel administrativo
  como alcance futuro, no como entregable de esta etapa.
- **Reversibilidad.** La documentacion no cierra la puerta: si el grupo despues
  quiere el panel, el contenido ya esta estructurado en JSON y migra a tablas
  sin reescribir las vistas.

## Consecuencias

- Quien reciba el sitio necesita **cuenta de GitHub con permiso de escritura**
  en el repositorio. Darsela es parte de la entrega.
- La capacitacion es parte de la entrega, no un extra: recorrer la guia con la
  persona a cargo y hacer juntos un cambio real de punta a punta.
- **La agenda no caduca sola.** Sin panel ni logica de fechas, alguien tiene que
  revisarla. Eso es el issue #46.
- El flujo de publicacion sigue siendo `dev` -> `qa` -> `main`, con visto bueno
  de jefatura y administracion antes de promover (10.2).
- El panel administrativo queda registrado como trabajo **posterior al TCU**, no
  descartado.

## Quien queda a cargo

| Rol                                   | Persona                     |
| ------------------------------------- | --------------------------- |
| Consultas de contenido (10.1)         | Elena Manzanarez Juarez     |
| Visto bueno antes de publicar (10.2)  | Jefatura de grupo y administracion |
| Mantenimiento del sitio (10.3)        | Comunicacion y Tecnologia — **nombre por confirmar** |
| Revision de la agenda (5.3)           | Comunicacion y Tecnologia — **nombre por confirmar** |

**Este es el unico lugar canonico del nombre.** Las respuestas 5.3 y 10.3
nombran a la misma persona de dos formas distintas («Juan David Loria» y «Jose
David Loria») y falta saber si es una persona o dos. Es el issue #41. Cuando el
grupo responda se escribe aca y se actualiza `contenido-pendiente.md`.

Ningun nombre se publica hoy en el sitio, asi que la contradiccion no produce
ningun error visible.

## Si mas adelante se quiere el panel

No hay que rehacer el contenido. La ruta seria:

1. Issue #47: tablas, RLS, buckets y autenticacion en Supabase.
2. Migrar `content.agenda` y `news.items` de `messages/es.json` a tablas.
3. CRUD autenticado sobre esas dos tablas — son las unicas que cambian seguido.
4. El resto del contenido puede quedarse en JSON: casi nunca cambia.

Los arreglos paralelos por indice (`AGENDA_TONES`, `TEAM_SECTIONS`) desaparecen
en esa migracion: pasan a ser columnas.
