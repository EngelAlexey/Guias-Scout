# Mapeo de respuestas · uso interno del equipo

Traduce cada pregunta de [`formulario-grupo-35.md`](./formulario-grupo-35.md) al
lugar exacto del codigo donde quedo la respuesta. El formulario que se le entrega
al grupo no contiene rutas ni nombres de claves a proposito.

Estado: **55 de 56 respondidas e integradas**. Lo que sigue abierto esta en
[`contenido-pendiente.md`](./contenido-pendiente.md).

Convenciones que cambiaron al integrar:

- Los datos de contacto se repetian en tres vistas. Ahora viven **una sola vez**
  en `content.contact` y cada vista solo pone su propia etiqueta. Esto reemplaza
  el boceto original de tres claves separadas por dato.
- Los arreglos nuevos (`content.milestones`, `content.team`, `content.agenda`,
  `content.groupAreas`, `content.themes`, `join.facts`) se leen con
  `t.raw(...) as T[]`, igual que `content.values`.
- `TEAM_SECTIONS` y `AGENDA_TONES` (`lib/content/site.ts`) son **paralelos por
  indice** a `content.team[]` y `content.agenda[]`, igual que `SDG` lo es a
  `content.sdg[]`. Si cambia el largo de uno hay que cambiar el del otro:
  TypeScript no lo detecta.

## 1. Como los encuentra la gente

| #   | Destino                                         | Estado |
| --- | ----------------------------------------------- | ------ |
| 1.1 | `content.contact.address`                       | listo  |
| 1.2 | `content.contact.addressShort` (pie)            | listo  |
| 1.3 | `content.contact.meetings`                      | listo  |
| 1.4 | `content.contact.meetingsNote`                  | listo  |
| 1.5 | —                                               | **abierto.** Correo institucional sin crear. Sobreviven 3 `PendingValue` |
| 1.6 | `content.contact.phone` + `.phoneNote`, `CONTACT.phoneHref` | listo. Se publica como enlace `tel:`, sin afirmar WhatsApp porque no lo dijeron |
| 1.7 | —                                               | **abierto.** Sin respuesta. La fila de redes del pie sigue sin crearse |
| 1.8 | `site.name`, `site.shortName`                   | listo. `shortName` = «Grupo 35 Esparzol» es derivacion nuestra: el formulario solo dio el nombre largo |
| 1.9 | `NEXT_PUBLIC_SITE_URL`                          | respondido: no tienen dominio |

`footer.copyright` perdio el « de Costa Rica» final: ya viene dentro de
`site.name` y si no se duplicaba.

## 2. Historia

| #   | Destino                                     | Estado |
| --- | ------------------------------------------- | ------ |
| 2.1 | `about.history.lead` + `.foundationValue`   | listo  |
| 2.2 | —                                           | **abierto.** «Sin ese dato». `PendingValue` en la metrica del medio |
| 2.3 | `about.history.leadersValue`                | listo. La etiqueta cambio a «personas adultas voluntarias»: son 22 entre dirigentes **y colaboradores**, publicarlos como dirigentes sobre-afirmaba |
| 2.4 | `about.history.lead`                        | listo  |
| 2.5 | `about.history.story`                       | listo **solo con Elena**. Falta consentimiento de la segunda persona |
| 2.6 | `content.milestones[]`                      | listo con 2020 y 2024. **Canapas queda fuera**: 2.6 lo pone en 2026 y 5.1 en enero de 2027 |
| 2.7 | `about.history.sponsor`                     | listo  |

El titulo del bloque cambio: «Del primer campamento a la casa digital» era
invencion nuestra y ademas contradecia una fundacion de 2020.

## 3. Equipo

| #   | Destino                                          | Estado |
| --- | ------------------------------------------------ | ------ |
| 3.1 | `content.team[]` + `TEAM_SECTIONS`               | listo con 2 de 22 personas |
| 3.2 | `.avatar` con iniciales                          | listo. El grupo pidio no publicar fotos, asi que `public/equipo/` no se creo |
| 3.3 | `about.team.lead`, `.structureTitle`, `content.groupAreas[]` | listo. Se corrigio «consejo de personas adultas» por **Junta de Grupo** |

## 4. Vision y valores

| #   | Destino                        | Estado |
| --- | ------------------------------ | ------ |
| 4.1 | `about.purpose.visionText`     | listo. Se quito el `PendingValue` |
| 4.2 | `content.values[]`             | listo. Honestidad → Liderazgo, y septimo valor publicado como «Amigos de todos» (por confirmar la redaccion) |
| 4.3 | `site.motto`                   | listo. Se renderiza como `.eyebrow` en el cierre de portada |

## 5. Agenda

| #   | Destino                              | Estado |
| --- | ------------------------------------ | ------ |
| 5.1 | `content.agenda[]` + `AGENDA_TONES`  | listo, 4 actividades |
| 5.2 | —                                    | respondido: no hay calendario anual. **Se quito el enlace a `/news`** de la portada |
| 5.3 | —                                    | **abierto.** 5.3 dice «Juan David Loria» y 10.3 «Jose David Loria»: falta aclarar |

La agenda se decidio **estatica** en `messages/es.json`, no en Supabase: cuatro
entradas no justifican una tabla y la segunda mitad del proyecto todavia no
define el modelo de datos.

## 6. Inscripcion

| #   | Destino                              | Estado |
| --- | ------------------------------------ | ------ |
| 6.1 | `join.facts[0]` + `join.steps.items[2].detail` | listo. Se elimino la promesa de «se define la cuota de apoyo» |
| 6.2 | `join.facts[1]`                      | listo  |
| 6.3 | `join.facts[2]`                      | listo. Ojo: «Octubre de 2026» caduca solo |
| 6.4 | `join.contact.checklist[]`           | confirmado tal cual, sin cambios |
| 6.5 | `join.facts[3]` + `join.factsNote`   | listo  |
| 6.6 | `join.steps.items[]`                 | listo, reescritos con el flujo real |

## 7. Verificacion con la Asociacion

| #   | Destino                                   | Estado |
| --- | ----------------------------------------- | ------ |
| 7.1 | `content.sections.*.name`, `.ages`        | confirmado, sin cambios |
| 7.2 | `content.sections.*.facts` («Se les llama») | listo en Manada, Tropa y Wak. **Comunidad sin `value`** → `PendingValue` |
| 7.3 | `content.sections.*.unit`                 | confirmado, sin cambios |
| 7.4 | `content.sections.*.facts` («Organo de decision») | listo en Manada y Tropa. Wak y Comunidad no se listan |
| 7.5 | `content.promise`                         | confirmado exacto |
| 7.6 | `content.scoutLaw[]`                      | confirmado exacto y en ese orden |
| 7.7 | `app/globals.css`, `data-seccion`         | la **asignacion** quedo confirmada; los **hex exactos siguen sin fuente oficial**. Sin cambio de CSS |
| 7.8 | `content.sections.*.facts` («Marco simbolico») | listo en Manada, Tropa y Wak. **Comunidad sin `value`** |
| 7.9 | `SDG` + `content.sdg[]`, y `content.themes[]` | ODS 4/13/17 confirmados. Los dos temas propios van como `.chip` en `content.themes`, **nunca como `.ods-chip`**: no son ODS |
| 7.10 | `content.sections.*.description`          | confirmadas, sin cambios |

## 8. Imagenes

| #   | Estado |
| --- | ------ |
| 8.1 | **abierto.** 5 de 11 existen, ninguna entregada |
| 8.2 | **bloqueante legal.** Permisos de imagen de personas menores sin firmar, esperados el 9 de agosto de 2026. Hasta entonces no se toca ninguna foto |
| 8.3 | **abierto.** Logo propio existe, sin entregar |

Al sustituir cada imagen hay que reescribir su `imageAlt` correspondiente: los
textos actuales describen las fotos genericas de Unsplash, no las del grupo.

## 9. Segunda mitad

| #   | Estado |
| --- | ------ |
| 9.1 | Corrige el encuadre del sitio: el proyecto educativo es **musical**, no ambiental. Aplicado en `home.environment.*` e `impact.*` |
| 9.2 | Existe un informe social con datos historicos. Fuente para `/impact` |
| 9.3 | Banda Artistica Juvenil de Esparzol. Alimentara `/projects`. Las «8000 vistas» **no se publican**: unidad ambigua |
| 9.4 | Los avisos son publicos para cualquiera → `/news` no necesita autenticacion ni RLS |
| 9.5 | Formulario de inscripcion: datos de personas menores, definir custodia antes de construir |
| 9.6 | Formulario de voluntariado: preguntar por que desea formar parte; las solicitudes llegan a la Junta de Grupo |
| 9.7 | **No hace falta ingles.** `i18n/routing.ts` se queda con `locales: ["es"]` |

## 10. Operacion

| #    | Estado |
| ---- | ------ |
| 10.1 | Consultas de contenido: Elena Manzanarez Juarez |
| 10.2 | Visto bueno antes de publicar: jefatura de grupo y administracion. Aplica antes de promover `dev` → `qa` → `main` |
| 10.3 | El sitio queda a cargo de Comunicacion y tecnologia. Falta decidir si hace falta panel administrativo (Supabase + auth) o basta con documentacion |
| 10.4 | Sin cuenta ni servicio pagado. Ver 1.9 |
| 10.5 | **Permiso concedido** para usar el emblema en `public/logo.webp` |

## Huecos detectados que siguen abiertos

- Los `imageAlt` quedan invalidos cuando se sustituyan las fotos (ver 8.x).
- La fila de redes sociales del pie sigue sin crearse (1.7).
- La agenda no tiene logica de fechas: las actividades pasadas no desaparecen
  solas. Hay que revisarla antes de cada publicacion.
- `join.facts[2]` publica «Octubre de 2026» como proxima inscripcion: tambien
  caduca solo.
