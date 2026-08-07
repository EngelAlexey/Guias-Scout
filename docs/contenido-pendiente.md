# Contenido pendiente de confirmar con el grupo

El sitio **no publica datos inventados**. Toda informacion que solo pueden
aportar las personas del Grupo 35 (fechas, cantidades, direcciones, contactos,
nombres, actividades) aparece marcada en la interfaz con `PendingValue` o
`PendingNote` (`components/pending.tsx`).

Este archivo es la lista de lo que hay que preguntar. Al recibir cada dato:
escribirlo en `messages/es.json` y quitar el marcador de la vista.

El grupo respondio 55 de 56 preguntas del formulario
(`docs/formulario-grupo-35.md`); las respuestas y su destino en el codigo estan
en `docs/mapeo-respuestas.md`. Lo que sigue es **solo lo que quedo abierto**.

## 1. Identidad y contacto

| Dato                       | Estado                                            |
| -------------------------- | ------------------------------------------------- |
| Correo de contacto          | **Pendiente.** El grupo va a usar uno institucional que todavia no existe. Marcado en `/es/about`, `/es/join` y el pie |
| Perfiles de redes sociales  | **Sin responder.** La fila del pie sigue quitada, no vacia. `.social-row`, `.social-link` y `SOCIAL_ICONS` estan listos y sin usar |

Resueltos: direccion, dia y hora de reunion, receso de fin de ano, telefono
(`6010 1502`, responde la jefatura), nombre completo del grupo. Viven una sola
vez en `content.contact` de `messages/es.json`.

Sobre el correo: mientras no exista, **ningun texto del sitio promete atencion
por correo**. Los llamados a la accion dicen llamar o venir un domingo.

## 2. Historia del grupo

| Dato                                  | Estado                                    |
| ------------------------------------- | ----------------------------------------- |
| Cantidad de personas participantes    | **Pendiente.** El grupo no lleva ese dato. Marcado en la metrica del medio de `/es/about` |
| Nombre de la segunda persona fundadora | **Pendiente de consentimiento.** El formulario (2.5) pedia confirmar que las personas vivas estan de acuerdo con que se publique su nombre, y esa confirmacion no vino. Solo se publica a Elena Manzanarez Juarez, que ademas es la contraparte del proyecto |

Resueltos: fecha de fundacion (9 de noviembre de 2020), relato, institucion que
respalda, cantidad de personas adultas (22).

**Contradiccion sin resolver:** la respuesta 2.6 pone «Primer Campamento para
patrullas Canapas» como hito de 2026, pero la 5.1 lo pone como actividad de
enero de 2027. No puede ser las dos cosas. Se publica **solo como actividad
futura** en la agenda; no aparece entre los hitos. Hay que preguntarle al grupo
cual de las dos fechas es la correcta.

## 3. Equipo

De las 22 personas adultas, el grupo dio nombre y rol de **dos**. Esas dos se
publican en `/es/about`; falta el resto y el `PendingNote` de la seccion lo dice
en pantalla.

El grupo pidio **no publicar fotos del equipo** (3.2), asi que las tarjetas usan
la clase `.avatar` con las iniciales de cada persona.

Nota de redaccion: el rol de Elena Manzanarez Juarez se publica como «Jefe de
grupo» porque asi lo escribio el grupo. Si prefieren «Jefa», es un cambio de una
palabra en `content.team` de `messages/es.json`.

## 4. Agenda y actividades

Las cuatro actividades de la respuesta 5.1 ya estan publicadas en `/es`
(`content.agenda`). El grupo **no maneja un calendario anual** (5.2), asi que se
quito el enlace «Ver calendario completo» que apuntaba a `/es/news`: esa pagina
esta en construccion y ademas esta bloqueada para buscadores en
`app/robots.ts`.

**Mantenimiento:** la agenda no tiene logica de fechas. Las actividades pasadas
**no desaparecen solas** y el sitio es estatico, asi que hay que revisar la
lista antes de cada publicacion. Dos de las cuatro fechas dicen «dia por
confirmar» porque el grupo solo dio el mes.

Falta definir quien del grupo mantiene la lista al dia (la respuesta 5.3 nombra
a «Juan David Loria» y la 10.3 a «Jose David Loria»: hay que aclarar cual es).

## 5. Vision y valores

La vision del grupo (4.1) y el lema «Siempre Mejor» (4.3) ya estan publicados.
La mision sigue siendo la del Movimiento Scout, adoptada por la Asociacion, y se
cita como tal.

Los valores quedaron confirmados con dos cambios del grupo: «Honestidad» salio y
entro «Liderazgo», y se agrego uno mas.

Pendiente menor: el septimo valor lo escribieron como «El Scouts es amigos de
todos». Se publica como **«Amigos de todos»** para que funcione como etiqueta
corta. Conviene que lo confirmen.

## 6. Por verificar con la Asociacion

Casi todo quedo confirmado por la jefatura de grupo:

| Punto                                    | Estado                                  |
| ---------------------------------------- | --------------------------------------- |
| Nombres de secciones y rangos de edad    | Confirmado                              |
| Unidades (seisenas, patrullas, equipos)  | Confirmado                              |
| Texto de la Promesa                      | Confirmado, exacto                      |
| Texto y orden de la Ley                  | Confirmado, exacto                      |
| Descripciones de cada seccion            | Confirmadas                             |
| Como se llaman las personas integrantes  | Confirmado en Manada, Tropa y Wak. **Falta Comunidad** |
| Marco simbolico                          | Confirmado en Manada, Tropa y Wak. **Falta Comunidad** |
| Organo de decision                       | Confirmado en Manada (Consejo de la Roca) y Tropa. **Faltan Wak y Comunidad** |
| Objetivos de Desarrollo Sostenible        | Confirmados 4, 13 y 17                  |

Los dos huecos de Comunidad estan marcados en pantalla en `/es/sections`: el
objeto de `facts` conserva su `label` y omite el `value`, y la vista cae en
`PendingValue`. Los organos que faltan simplemente no se listan: no listar algo
no es lo mismo que afirmar algo falso.

**Colores de seccion.** El formulario mostraba la asignacion que usa el sitio
(amarillo Manada, verde Tropa, azul Wak, rojo Comunidad) y el grupo la
confirmo. Lo que **sigue sin fuente oficial son los valores hexadecimales
exactos**: los de `app/globals.css` vienen del prototipo de diseno. Si la
Asociacion tiene una guia de marca, hay que contrastarlos.

## 7. Imagenes

**Bloqueante legal.** Los permisos de las familias para publicar imagenes de
personas menores de edad **no estan firmados**; el grupo los esperaba para el 9
de agosto de 2026 (8.2). Hasta que existan **no se sustituye ninguna foto**.

El grupo dice tener 5 de las 11 fotos que pide el sitio (portada, grupo
completo, jovenes trabajando, Manada, Tropa) pero **todavia no las ha
entregado** (8.1). Tambien tiene logo propio, sin entregar (8.3).

Mientras tanto siguen las 11 fotos de Unsplash de `lib/content/site.ts`, con
textos alternativos genericos a proposito. **Al sustituir cada foto hay que
reescribir su `imageAlt`**: los textos actuales describen las fotos de banco, no
las del grupo.

El uso del emblema de la Asociacion en `public/logo.webp` **si esta autorizado**
(10.5).

## Enfoque del grupo

El proyecto educativo del Grupo 35 tiene **enfoque musical**: la Banda Artistica
Juvenil de Esparzol (9.1 y 9.3). Alrededor de ella el grupo trabaja el rescate
del patrimonio inmaterial y las buenas practicas (7.9).

El sitio se habia escrito con un encuadre ambiental de fondo. El eje ambiental
sigue vivo —«Cuido del ambiente» es uno de los valores y el ODS 13 quedo
confirmado— pero **dejo de ser el encuadre principal**: la franja de portada
ahora presenta la Banda, y `/es/impact` se llama «Impacto» y no «Impacto
ambiental».

El dato de «unas 8000 vistas» de la respuesta 9.3 **no se publica**: no quedo
claro vistas de que ni en que plazo, y el sitio se sostiene sobre datos
verificables.

## Segunda mitad en pantalla

`/es/impact`, `/es/projects` y `/es/news` ya son paginas reales sobre la base
de diseno. Lo que sigue abierto:

- **Impacto:** los numeros esperan el informe social (9.2) para llenar
  `impact.axes` en `messages/es.json`. Las etiquetas estan publicadas con
  `PendingValue` hasta que la jefatura confirme cifras.
- **Proyectos:** el catalogo arranca con la Banda Artistica Juvenil de Esparzol
  (`projects.items[0]`) y crece con lo que el grupo confirme. Las «8000 vistas»
  no se publican.
- **Comunicados:** la lista vive en `news.items[]` y esta vacia. Sin
  autenticacion ni RLS (9.4). El calendario se suma cuando el grupo maneje uno
  (5.2).

## Dominio

El grupo **no tiene dominio propio ni servicio contratado** (1.9 y 10.4).
Mientras no exista, `SITE_URL` cae en `http://localhost:3000`. Antes de publicar
hay que definir `NEXT_PUBLIC_SITE_URL` en el entorno: de ahi salen
`metadataBase`, el sitemap y `robots.txt`.

## Idiomas

El grupo dijo que **no hace falta version en ingles** (9.7). `i18n/routing.ts`
se queda con `locales: ["es"]`.

## Registro del texto

El sitio se escribe en espanol de Costa Rica, con voseo (`vení`, `llamanos`,
`contanos`, `conocé`, `sumate`). Al agregar textos hay que mantener ese
registro y evitar formas peninsulares.

La decision sobre el titulo del enlace quedo **cerrada**: se mantiene el voseo,
«Unite», y el cambio a «Unete» se revirtio en `nav.join`, `join.metaTitle` y
`designSystem.splitTextDone` de `messages/es.json`.
