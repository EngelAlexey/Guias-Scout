# Supabase

Supabase almacena las solicitudes de inscripción y voluntariado. Los datos
personales nunca se envían directamente desde el navegador a una tabla: el
formulario llama a `POST /api/recruitment` y esa ruta valida y guarda la
solicitud mediante una clave exclusiva del servidor.

## Variables requeridas

Crear `.env.local` (no se versiona) con:

```dotenv
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SECRET_KEY=sb_secret_REEMPLAZAR
```

- La URL aparece en **Connect** o **Settings > API Keys** del proyecto.
- La clave debe ser una **Secret key** (`sb_secret_...`). La antigua
  `service_role` también tiene privilegios equivalentes, pero Supabase
  recomienda las claves nuevas.
- La clave secreta no se debe pegar en código, commits, capturas, chats ni en
  ninguna variable que empiece por `NEXT_PUBLIC_`.

El cliente de navegador preparado para módulos futuros usa opcionalmente
`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Los
formularios actuales no requieren esas dos variables públicas.

## Crear las tablas

1. Abrir **SQL Editor** en el dashboard de Supabase.
2. Copiar todo el contenido de
   `supabase/migrations/202608150001_create_recruitment_submissions.sql`.
3. Ejecutar el script una sola vez.
4. Confirmar en **Table Editor** que existan:
   - `minor_enrollment_submissions`
   - `volunteer_submissions`

La migración activa Row Level Security y revoca el acceso a los roles públicos
`anon` y `authenticated`. No crea políticas públicas de lectura o escritura;
solo el backend con la clave secreta puede acceder a los registros.

## Datos almacenados

`minor_enrollment_submissions` guarda los datos de la persona menor, fecha de
nacimiento, persona encargada, contacto, sección de interés, mensaje,
consentimiento, estado y fechas de seguimiento.

`volunteer_submissions` guarda nombre, contacto, tipo de colaboración,
motivación, consentimiento, estado y fechas de seguimiento.

Las opciones de sección y colaboración se guardan con identificadores estables
(`manada`, `leader`, etc.), no como textos traducidos.

## Desarrollo y despliegue

Después de crear `.env.local`, reiniciar `pnpm dev`. En el proveedor de
despliegue se deben crear las mismas variables `SUPABASE_URL` y
`SUPABASE_SECRET_KEY` como secretos de servidor y volver a desplegar.

Para una prueba completa:

1. Enviar una solicitud desde `/es/join`.
2. Verificar el mensaje de éxito en pantalla.
3. Confirmar la fila nueva desde **Table Editor** en Supabase.
4. Comprobar que el navegador no recibe ni expone `SUPABASE_SECRET_KEY`.

## Portal de encargados

El portal (`/es/portal`) usa una tabla propia y las cuentas de **Supabase Auth**.

### Tabla `portal_users`

Migración: `supabase/migrations/202608170001_create_portal_users.sql`. Se corre
igual que la anterior, desde el **SQL Editor**, una sola vez. Es idempotente:
correrla dos veces no rompe nada.

| Columna | Para qué |
| --- | --- |
| `id` | Identificador de la persona encargada dentro del portal |
| `auth_user_id` | Id de su cuenta en Supabase Auth. Queda en `null` hasta su primera entrada, cuando el portal lo llena solo |
| `full_name` | Nombre que se muestra en el encabezado del portal |
| `email` | Correo con el que entra. Se guarda en minúsculas y es único |
| `is_active` | En `false` la persona conserva su fila pero no puede entrar |
| `created_at` / `updated_at` | Fechas de control |

La tabla tiene RLS activo y ninguna política pública: `anon` y `authenticated`
no tienen ningún permiso. Solo el backend con la clave secreta la lee o la
escribe.

La misma migración agrega `reviewed_by` y `reviewed_at` a las dos tablas de
solicitudes, para saber quién movió el estado por última vez, y dos índices por
`(status, created_at)` porque el portal lista siempre filtrando por estado.

### Cómo entra la primera persona

1. En **Authentication > Users** del dashboard, **Add user** con su correo y una
   clave temporal.
2. En **SQL Editor**, insertar su fila en el portal:

   ```sql
   insert into public.portal_users (full_name, email)
   values ('Nombre Apellido', 'correo@ejemplo.org');
   ```

3. Entrar a `/es/portal/login` con ese correo y esa clave. En esa primera
   entrada el portal completa `auth_user_id`.

Las dos cosas son necesarias: la cuenta de Auth valida la clave y la fila de
`portal_users` autoriza el acceso. Si falta cualquiera de las dos, el portal
responde lo mismo que ante una clave equivocada.

### Por qué clave y no enlace mágico

El enlace mágico necesita un servidor de correo propio: el correo integrado de
Supabase está limitado a unos pocos envíos por hora y avisa que no es para
producción. El grupo todavía no tiene ese servicio configurado. Con clave, la
jefatura no depende de que llegue un correo para entrar, y agregar a alguien es
crear su cuenta y su fila.

Queda anotado para más adelante: si el grupo llega a tener correo saliente
propio, cambiar a enlace mágico solo toca la ruta `/api/portal/login` y el
formulario de acceso.

### Sesión

La sesión del portal **no** es la de Supabase. `/api/portal/login` verifica la
clave contra Supabase Auth desde el servidor y luego pone una cookie propia,
`portal_sesion`: `httpOnly`, `sameSite=lax`, `secure` en producción y ocho horas
de vida. La cookie lleva el id de la persona y una firma HMAC hecha con
`PORTAL_SESSION_SECRET`.

Los tokens de Supabase nunca llegan al navegador. `lib/portal/session.ts` es la
única fuente de verdad: verifica la firma, revisa el vencimiento y consulta
`is_active` en cada carga, así que desactivar a alguien la saca del portal en la
siguiente página que abra.

`PORTAL_SESSION_SECRET` es una cadena aleatoria de al menos 32 caracteres. Se
puede generar con:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Va en `.env.local` y como secreto de servidor en el proveedor de despliegue.
Cambiarla cierra todas las sesiones abiertas.

### Variables que agrega el portal

```dotenv
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REEMPLAZAR
PORTAL_SESSION_SECRET=cadena-aleatoria-de-48-bytes
```

La clave publicable pasa a ser obligatoria: es la que usa el servidor para
comprobar la clave de la persona contra Supabase Auth. La clave secreta sigue
siendo la única que toca los datos.

## Módulos futuros

Galería, noticias y métricas todavía requieren definir sus reglas funcionales
antes de crear tablas o buckets. Cada módulo debe agregar su propia migración,
permisos RLS y documentación.
