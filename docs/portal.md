# Portal de encargados

Guia de uso del portal interno del Grupo 35. Esta escrita para la Junta de Grupo:
no hace falta saber programar para seguirla.

El portal es interno y queda solo en espanol. La version en ingles del sitio publico
se trabaja aparte.

---

## 1. Para que sirve

Las solicitudes de inscripcion y de voluntariado que llegan del sitio se guardan en
Supabase. Antes habia que entrar al panel de Supabase para verlas. El portal las
muestra en una pantalla propia, permite cambiar el estado de cada una y define
quien de la Junta puede entrar.

Lo que el portal **si** hace:

- Mostrar las solicitudes de los dos formularios del sitio.
- Cambiar el estado de una solicitud o descartarla.
- Agregar, modificar y desactivar personas encargadas.

Lo que el portal **no** hace (fuera de alcance):

- **Roles y permisos.** Quien entra ve y hace lo mismo que cualquier otra persona
  encargada. Desactivar el acceso es el unico control disponible.
- **Seguimiento tipo CRM.** No hay historial de conversaciones, notas encadenadas,
  recordatorios ni asignacion de responsables.
- Notificaciones por correo, exportaciones y busqueda avanzada.
- Borrado permanente de personas encargadas: desactivar conserva la fila.
- Invitaciones y avisos por correo: el grupo no tiene correo saliente propio, asi
  que la clave temporal se pasa a mano.
- Foto de perfil y recuperacion de clave por autoservicio: quien pierde la suya
  necesita que otra persona encargada se la restablezca.

---

## 2. Como entra una persona encargada

1. Abrir `/es/portal/login`. Tambien se llega desde el boton con el icono de persona
   del menu del sitio.
2. Escribir el correo y la clave.
3. Si los datos son correctos y el acceso esta activo, el portal abre en el resumen.

Quien agrega a la persona en `/es/portal/usuarios` recibe en pantalla una **clave
temporal** y se la pasa. Con esa clave la persona entra una vez y el portal le pide
elegir una propia antes de dejarla pasar a las demas pantallas.

El acceso es con correo y clave, no con enlace magico: el enlace exige correo saliente
propio que el grupo todavia no tiene. Por eso la clave temporal se muestra en pantalla
en vez de mandarse por correo, y hay que pasarsela a la persona por el medio que el
grupo use.

**Si alguien no puede entrar,** revisar en este orden:

1. Que aparezca en `/es/portal/usuarios` con estado **Activa**.
2. Que la fila no diga «Todavia no tiene clave»: si lo dice, tocar **Restablecer
   clave** y pasarle la temporal nueva.
3. Si perdio la clave, **Restablecer clave** le genera otra.

### Rutas del portal

| Ruta | Contenido |
| --- | --- |
| `/es/portal/login` | Acceso con correo y clave |
| `/es/portal` | Resumen: cuantas solicitudes estan sin atender |
| `/es/portal/solicitudes` | Lista de solicitudes de los dos formularios |
| `/es/portal/usuarios` | Personas encargadas |
| `/es/portal/clave` | Cambiar la propia clave |

Todas las paginas del portal se publican con `noindex`: no aparecen en buscadores.
La sesion dura hasta que vence o hasta tocar **Salir**.

---

## 3. Que significa cada estado

Los cinco estados son los mismos en la lista, en el filtro y en el detalle. Salen de
`portal.statuses` en `messages/es.json`; ninguna pantalla debe inventar otro nombre.

| Estado | Se lee | Cuando se usa |
| --- | --- | --- |
| `pending` | Pendiente | Llego del sitio y todavia nadie la atendio. |
| `contacted` | Contactada | Alguien de la Junta ya se comunico con la persona y espera respuesta. |
| `accepted` | Aceptada | La solicitud siguio adelante: la persona queda inscrita o entra como voluntaria. |
| `rejected` | Rechazada | La solicitud no sigue adelante y ya se le aviso a la persona. |
| `archived` | Archivada | Se descarta sin resolver: duplicada, de prueba o sin datos para responder. |

Diferencia entre **Rechazada** y **Archivada**: en la primera hubo una respuesta a la
persona; en la segunda la solicitud se descarta sin contestarla. Toda solicitud nace
en **Pendiente**.

---

## 4. Como se maneja quien entra al portal

Todo ocurre en `/es/portal/usuarios`.

### Agregar

1. Escribir nombre y correo en **Agregar una persona encargada**.
2. Tocar **Agregar**.

El correo tiene que ser el mismo con el que la persona va a entrar. Se guarda siempre
en minusculas y no puede repetirse: si ya existe, el portal avisa que ese correo ya
esta registrado en otra persona encargada.

Al agregarla, el portal crea su cuenta de acceso y muestra una **clave temporal**:
copiar el correo y la clave del recuadro, pasarselos a la persona y tocar
**Ya la anote** para cerrarlo.

La clave temporal se muestra **una sola vez**: no queda guardada en ningun lado en
texto plano. Si se pierde, hay que restablecerla.

### Restablecer la clave

Para quien olvido su clave, o para las filas viejas que quedaron sin cuenta de acceso:

1. Tocar **Restablecer clave** en su fila. El portal pregunta antes de hacer nada.
2. Confirmar con **Si, restablecer**.
3. Pasarle la clave temporal nueva.

La clave anterior deja de servir en ese momento, y al entrar el portal le vuelve a
pedir que elija una propia.

### Cambiar la propia clave

Desde **Cambiar mi clave**, en la fila propia de `/es/portal/usuarios`, la que
esta marcada con **(Tu)**. Pide la clave actual y la nueva dos veces. Quien entra con una temporal va derecho a esa pantalla y no puede hacer otra
cosa hasta cambiarla.

### Modificar

1. Tocar **Modificar** en la fila de la persona.
2. Corregir nombre o correo.
3. Tocar **Guardar**, o presionar Enter. **Cancelar** deja todo como estaba.

### Desactivar y reactivar

1. Tocar **Desactivar**. El portal pregunta antes de hacer nada.
2. Confirmar con **Si, desactivar**.

La persona desactivada conserva su fila y su historial, pero deja de entrar al portal
de inmediato: si tenia la sesion abierta, la proxima pantalla que abra la manda al
acceso. **Reactivar** le devuelve el acceso.

Nadie puede desactivarse a si mismo. Su propia fila aparece marcada con **(Tu)** y el
boton queda deshabilitado; hay que pedirselo a otra persona encargada. Asi se evita
que el portal se quede sin nadie que pueda entrar.

**No hay borrado.** Desactivar es la forma de quitar el acceso a quien ya no esta en
la Junta.

---

## 5. Detalle tecnico

Esta seccion es para quien programa; la Junta no la necesita.

### Archivos

| Archivo | Que hace |
| --- | --- |
| `app/api/portal/users/route.ts` | API de personas encargadas (`GET`, `POST`, `PATCH`) |
| `app/api/portal/users/reset/route.ts` | Restablecer la clave de una persona |
| `app/api/portal/password/route.ts` | Cambiar la propia clave |
| `app/[locale]/portal/clave/page.tsx` | Pantalla de cambio de clave |
| `lib/portal/passwords.ts` | Generador de claves temporales y limites de largo |
| `lib/portal/auth-users.ts` | Cuentas de Supabase Auth: crear, buscar y cambiar la clave |
| `app/[locale]/portal/(panel)/usuarios/page.tsx` | Pagina protegida de personas encargadas |
| `components/portal/users-manager.tsx` | Lista, formularios y acciones de la vista |
| `lib/portal/session.ts` | `getPortalSession()`: firma, vencimiento y `is_active` |
| `supabase/migrations/202608170001_create_portal_users.sql` | Tabla `portal_users` y columnas de seguimiento |
| `supabase/migrations/202608210001_portal_users_temporary_password.sql` | Columna `must_change_password` |

### Contrato de la API

| Metodo y ruta | Cuerpo | Respuesta |
| --- | --- | --- |
| `GET /api/portal/users` | — | `{ ok: true, items: [{ id, fullName, email, isActive, createdAt, hasAccount, mustChangePassword }] }` ordenado por nombre |
| `POST /api/portal/users` | `{ fullName, email }` | `201 { ok: true, id, temporaryPassword }` |
| `PATCH /api/portal/users` | `{ id, fullName?, email?, isActive? }` | `{ ok: true }` |
| `POST /api/portal/users/reset` | `{ id }` | `{ ok: true, temporaryPassword }` |
| `POST /api/portal/password` | `{ currentPassword, newPassword }` | `{ ok: true }` |

`GET` devuelve ademas `hasAccount` y `mustChangePassword` por persona, que es lo que
la vista usa para avisar «Todavia no tiene clave» o «Tiene una clave temporal sin
cambiar».

La clave temporal viaja una sola vez, en la respuesta de `POST`: no se guarda en la
tabla ni se puede volver a consultar. En Supabase Auth queda con hash, como cualquier
otra.

Errores, con el mismo formato del resto del sitio (`{ ok: false, error }`):

| Codigo | Error | Cuando |
| --- | --- | --- |
| 400 | `invalid_request` | Falta un dato, el formato no sirve o el `PATCH` no trae ningun campo que cambiar |
| 401 | `unauthorized` | No hay sesion, vencio, o la persona esta desactivada |
| 404 | `not_found` | El `id` del `PATCH` no existe |
| 409 | `email_taken` | Ese correo ya esta en otra fila |
| 409 | `self_deactivation` | Se intento desactivar a la persona de la propia sesion |
| 401 | `wrong_password` | La clave actual no coincide, al cambiarla |
| 409 | `same_password` | La clave nueva es igual a la actual |
| 500 | `storage_error` | Supabase respondio con error |
| 503 | `service_unavailable` | Faltan variables de entorno u otra falla de configuracion |

`not_found`, `email_taken` y `self_deactivation` son agregados al contrato original
del sprint, que solo nombraba `invalid_request`, `unauthorized` y `storage_error`.
La vista traduce cada codigo a una frase entendible y nunca muestra el codigo crudo.

Validacion del lado del servidor: nombre de 1 a 160 caracteres (espacios de sobra
colapsados), correo con formato valido de hasta 254 caracteres y siempre en
minusculas. Los mismos limites se revisan en el navegador antes de enviar.

### Textos

Todo lo que se lee en el portal vive bajo `portal.*` en `messages/es.json`:

| Llave | Para que |
| --- | --- |
| `portal.login` | Pantalla de acceso |
| `portal.shell` | Marco: nombre, salir, saltar al contenido |
| `portal.nav` | Nombres de las secciones del portal |
| `portal.home` | Resumen |
| `portal.users` | Personas encargadas |
| `portal.password` | Pantalla de cambio de clave |
| `portal.statuses` | Los cinco estados y su explicacion |

Convenciones de redaccion:

- Voseo, igual que el sitio publico: «Escribi», «Agrega», «pedile».
- Los errores dicen que paso y que hacer, sin nombrar codigos ni tablas.
- Los nombres de los codigos de error se repiten tal cual como llaves
  (`errors.email_taken`), tambien en la pantalla de acceso, para que un codigo nuevo
  se traduzca sin adivinar.
- «Persona encargada», no «usuario», en todo el portal.

### Variables de entorno

`PORTAL_SESSION_SECRET` (minimo 32 caracteres), `SUPABASE_URL`, `SUPABASE_SECRET_KEY`
y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. El detalle esta en `docs/supabase.md`.

---

## 6. Accesibilidad del portal

Revision hecha sobre los mismos criterios de `docs/accesibilidad-y-rendimiento.md`
(WCAG 2.1 AA).

| Punto | Como quedo |
| --- | --- |
| Enlace de salto | `Ir al contenido del portal` antes del encabezado, visible al recibir foco |
| Foco visible | Anillo ambar de 3px de `:focus-visible`, heredado del sitio publico |
| Teclado | Toda la vista de personas encargadas se recorre con Tab; Enter guarda la edicion en linea; ningun control depende del mouse |
| Etiquetas | Cada campo tiene `<label>` asociado, incluidos los de edicion en linea, con etiqueta oculta pero leible por lector de pantalla |
| Errores de campo | `aria-invalid` y `aria-describedby` apuntando al mensaje, ademas del texto en rojo |
| Avisos de resultado | Region `role="status"` con `aria-live="polite"`: el lector anuncia «ya no puede entrar al portal» sin robar el foco |
| Confirmacion de desactivar | Pregunta en la propia pagina, no `window.confirm`, para que se lea y se navegue igual que el resto |
| Tabla | `<caption>` oculto, `<th scope="col">` y `data-label` en cada celda para la lectura en pantalla angosta |
| Estados | El estado se distingue por texto («Activa» / «Inactiva»), no solo por color |
| Contraste | Verde `#1F6E44` sobre `#E8F3EC` y rojo `#C62828` sobre `#FDECEA` para las insignias de estado; texto principal `#2E1A47` sobre `#FFFFFF` |
| Pantalla angosta | Debajo de 860px la tabla se apila en fichas con la etiqueta de cada dato; la pagina no se desborda a lo ancho |
| Buscadores | Todas las paginas del portal van con `robots: noindex, nofollow` |

---

## 7. Checklist de prueba manual

Correr esta lista completa antes de integrar cambios del portal.

Preparacion: `pnpm dev`, entrar por `http://localhost:3000` (con `127.0.0.1` el
servidor de desarrollo bloquea sus propios recursos y la pagina no llega a
hidratarse, asi que los botones no responden).

| # | Paso | Resultado esperado |
| --- | --- | --- |
| 1 | Abrir `/es/portal/usuarios` sin sesion | Redirige a `/es/portal/login` |
| 2 | Entrar con correo y clave validos | Abre el resumen del portal |
| 3 | Entrar con clave equivocada | Mensaje de error, sin entrar |
| 4 | Abrir `/es/portal/solicitudes` | Se ven las solicitudes de los dos formularios |
| 5 | Cambiar el estado de una solicitud | El nuevo estado queda guardado al recargar |
| 6 | Abrir `/es/portal/usuarios` | Lista ordenada por nombre, con correo y estado |
| 7 | Tocar **Agregar** con los campos vacios | Dos mensajes de validacion, sin enviar nada |
| 8 | Agregar a alguien con correo valido | Aparece en la lista como **Activa** y sale el recuadro con la clave temporal |
| 8b | Entrar con esa clave temporal | Entra, pero el portal manda derecho a `/es/portal/clave` |
| 8c | Elegir una clave propia | Vuelve al portal; la temporal vieja ya no sirve |
| 8d | **Restablecer clave** a esa persona | Sale una temporal nueva y el portal vuelve a exigir el cambio |
| 9 | Agregar el mismo correo otra vez | Avisa que ya esta registrado, sin crear otra fila |
| 10 | Tocar **Modificar** y no tocar nada mas | La fila queda en edicion: no se guarda sola |
| 11 | **Modificar** nombre y correo, guardar con Enter y con el boton | Los datos nuevos quedan en la lista |
| 12 | **Desactivar** a esa persona | Pregunta antes; al confirmar queda **Inactiva** |
| 13 | Entrar al portal con esa persona desactivada | No entra: vuelve al acceso |
| 14 | **Reactivar** a esa persona | Vuelve a **Activa** y puede entrar |
| 15 | Intentar desactivar la propia fila | El boton esta deshabilitado y explica por que |
| 16 | Repasar la pagina con Tab, sin mouse | Todos los controles reciben foco visible, en orden |
| 17 | Abrir la vista en pantalla angosta | La tabla se apila en fichas y nada se desborda |

### Resultado de la corrida del 20 de agosto de 2026

Los pasos 8b a 8d se corrieron el 21 de agosto, cuando se agrego la clave temporal.

Corrida sobre `pnpm dev` con la base de Supabase del proyecto, usando una persona de
prueba que se borro al terminar.

| # | Resultado |
| --- | --- |
| 1 | Correcto: `307` a `/es/portal/login`, tanto en `/es/portal/usuarios` como en `/es/portal` |
| 2 | **Pendiente**: se probo la sesion valida y su vencimiento, no el formulario con clave real |
| 3 | **Pendiente**: igual que el 2 |
| 4 | **Pendiente**: `/es/portal/solicitudes` todavia no existe |
| 5 | **Pendiente**: igual que el 4 |
| 6 | Correcto: lista ordenada por nombre, con nombre, correo y estado |
| 7 | Correcto: «Escribi el nombre completo…» y «Escribi un correo valido…», sin llamar a la API |
| 8 | Correcto: `201` con clave temporal de 14 caracteres; espacios de sobra y mayusculas del correo quedaron normalizados |
| 8b | Correcto: entra y `/es/portal` y `/es/portal/usuarios` responden `307` a `/es/portal/clave` |
| 8c | Correcto: cambia la clave, pasa al portal, y la temporal vieja responde `401`. Con la clave actual equivocada responde `401 wrong_password` y repitiendo la misma, `409 same_password` |
| 8d | Correcto: temporal nueva distinta de la anterior, vuelve a pedir el cambio y la clave elegida antes deja de servir |
| 9 | Correcto: `409 email_taken`, tambien escribiendo el correo en mayusculas |
| 10 | Correcto despues de arreglar el bug: al tocar **Modificar** la fila entra en edicion y se queda ahi |
| 11 | Correcto: `200` con Enter y con el boton **Guardar**; la fila muestra los datos nuevos y el aviso «Guardamos los datos de…» |
| 12 | Correcto: pregunta en pantalla, y al confirmar la fila queda **Inactiva** con su explicacion |
| 13 | Correcto: la API responde `401` y `/es/portal` redirige al acceso |
| 14 | Correcto: vuelve a **Activa** |
| 15 | Correcto: el boton esta deshabilitado y la API responde `409 self_deactivation` |
| 16 | Correcto: foco visible en todos los controles; Enter guarda la edicion en linea |
| 17 | Correcto: debajo de 860px la tabla se apila con la etiqueta de cada dato |

Los pasos 2 a 5 quedan pendientes de la vista de solicitudes y de una cuenta de prueba
en Supabase Auth; hay que correrlos antes de publicar el portal.

Ademas de la lista: `pnpm typecheck`, `pnpm lint` y `pnpm build` corrieron sin errores,
y ninguna pantalla del portal mostro la ruta de una llave sin traducir.
