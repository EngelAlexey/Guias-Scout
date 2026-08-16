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

## Módulos futuros

Galería, autenticación, panel administrativo, noticias y métricas todavía
requieren definir sus reglas funcionales antes de crear tablas o buckets. Cada
módulo debe agregar su propia migración, permisos RLS y documentación.
