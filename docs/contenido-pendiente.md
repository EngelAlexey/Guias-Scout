# Contenido pendiente de confirmar con el grupo

El sitio **no publica datos inventados**. Toda informacion que solo pueden
aportar las personas del Grupo 35 (fechas, cantidades, direcciones, contactos,
nombres, actividades) aparece marcada en la interfaz con `PendingValue` o
`PendingNote` (`components/pending.tsx`).

Este archivo es la lista de lo que hay que preguntar. Al recibir cada dato:
escribirlo en `messages/es.json` y quitar el marcador de la vista.

## 1. Identidad y contacto

| Dato                       | Donde aparece                              |
| -------------------------- | ------------------------------------------ |
| Direccion de la sede        | `/es/about` (Donde estamos), pie de pagina |
| Dia y hora de reunion       | `/es/about`, `/es/join`, pie de pagina      |
| Correo de contacto          | `/es/about`, `/es/join`, pie de pagina      |
| Telefono o WhatsApp         | todavia no esta en el diseno                |
| Perfiles de redes sociales  | pie de pagina (la fila esta quitada)        |
| Dominio publico definitivo  | `NEXT_PUBLIC_SITE_URL` (ver mas abajo)      |

## 2. Historia del grupo

| Dato                                    | Donde aparece            |
| --------------------------------------- | ------------------------ |
| Ano de fundacion                        | `/es/about` (metrica)    |
| Relato de la historia                   | `/es/about` (bloque)     |
| Personas fundadoras, hitos              | `/es/about` (bloque)     |
| Cantidad de personas activas            | `/es/about` (metrica)    |
| Cantidad de dirigentes voluntarios      | `/es/about` (metrica)    |

## 3. Equipo

Nombres, roles, fotografias y una linea de descripcion por persona.
Aparece en `/es/about` (Quienes acompanan).

## 4. Agenda y actividades

Fechas, nombres y detalles de las proximas actividades. Aparece en `/es`
(Agenda) y sera el contenido de `/es/news` en la segunda mitad del proyecto.

## 5. Vision del grupo

La mision que se publica es la del Movimiento Scout, adoptada por la
Asociacion de Guias y Scouts de Costa Rica, y se cita como tal. La **vision
propia del grupo** esta pendiente (`/es/about`).

Los seis valores que se listan son una propuesta: conviene que el grupo los
confirme o los cambie.

## 6. Por verificar con la Asociacion

Esto se publico porque es programa del Movimiento, no invento del sitio, pero
conviene revisarlo con la Asociacion antes de dar por buena la pagina:

- Nombres de las cuatro secciones y sus rangos de edad.
- Como se llaman las personas integrantes de cada seccion. **Se quito del
  sitio** porque la version que habia (`lobatos y lobatas`, etc.) no estaba
  verificada y sonaba a espanol peninsular. Falta la forma correcta en Costa
  Rica antes de volver a ponerla.
- Unidades: seisenas, patrullas, equipos, comunidad.
- Organos: Consejo de Tropa, consejo de personas adultas.
- Texto exacto de la Promesa y de la Ley que usa la Asociacion.
- Colores oficiales de cada seccion. Los que usa el sitio (amarillo, verde,
  azul, rojo) vienen del prototipo de diseno, no de una fuente oficial.
- Objetivos de Desarrollo Sostenible con los que se alinea el grupo. El sitio
  muestra 4, 13 y 17 como referencia y lo advierte en pantalla.

## 7. Imagenes

Ninguna foto del sitio es del grupo: todas vienen de Unsplash y sus textos
alternativos las describen de forma generica a proposito. Hay que
reemplazarlas por fotos propias, con permiso de las familias para publicar
imagenes de personas menores de edad.

El logo si es real: `public/logo.webp`, emblema de la Asociacion de Guias y
Scouts de Costa Rica.

## Dominio

Mientras no exista dominio contratado, `SITE_URL` cae en
`http://localhost:3000`. Antes de publicar hay que definir
`NEXT_PUBLIC_SITE_URL` en el entorno: de ahi salen `metadataBase`, el sitemap
y `robots.txt`.

## Registro del texto

El sitio se escribe en espanol de Costa Rica, con voseo (`vení`, `escribinos`,
`contanos`, `conocé`, `sumate`). Al agregar textos hay que mantener ese
registro y evitar formas peninsulares.
