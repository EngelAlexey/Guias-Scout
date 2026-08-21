# Supabase

Supabase almacena las solicitudes de inscripción y voluntariado. Los datos
personales nunca se envían directamente desde el navegador a una tabla: el
formulario llama a `POST /api/recruitment` y esa ruta valida y guarda la
solicitud mediante una clave exclusiva del servidor. Cada solicitud también
crea un comprobante que una Edge Function entrega al correo indicado mediante
Resend.

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

Para habilitar los correos, ejecutar después:

`supabase/migrations/202608170001_create_recruitment_email_notifications.sql`

Y, a continuación:

`supabase/migrations/202608200001_migrate_recruitment_email_to_resend.sql`

El webhook seguro se versiona en:

`supabase/migrations/202608210001_create_recruitment_email_webhook.sql`

Esta segunda migración crea `recruitment_email_notifications`, los triggers que
encolan un correo por cada formulario y una función privada que permite a la
Edge Function reclamar cada trabajo sin duplicarlo.

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

## Comprobantes de correo con Supabase y Resend

La implementación vive en
`supabase/functions/notify-recruitment/index.ts`. Después de guardar la
solicitud, envía un comprobante con los campos que la persona completó y un
identificador único. En producción se entrega al correo suministrado; en modo
prueba se redirige a `RESEND_TEST_RECIPIENT`. Por eso el correo es obligatorio
en ambos formularios.

### 1. Configurar secretos de la Edge Function

Para probar sin configurar DNS, usar el dominio de prueba de Resend. En
**Supabase > Edge Functions > Secrets**, agregar:

```dotenv
RESEND_API_KEY=re_REEMPLAZAR
RESEND_FROM=Grupo 35 <onboarding@resend.dev>
RESEND_TEST_RECIPIENT=CORREO_DE_TU_CUENTA_RESEND
```

- `RESEND_TEST_RECIPIENT` debe ser exactamente el correo asociado a la cuenta
  de Resend. Mientras exista esta variable, todos los comprobantes se envían a
  esa dirección y el asunto se marca con `[PRUEBA]`.
- El correo escrito por la persona en el formulario se conserva y aparece en el
  comprobante, pero no se usa como destinatario durante la prueba.
- `onboarding@resend.dev` permite probar sin configurar DNS, pero Resend no
  permite usarlo para enviar correos reales a otros destinatarios.
- `RECRUITMENT_REPLY_TO` es opcional y permite que la persona responda al
  correo institucional del grupo.
- `RECRUITMENT_WEBHOOK_SECRET` es administrado por el script de configuración
  del webhook y no se debe copiar manualmente.
- No se deben versionar estos valores ni pegarlos en variables `NEXT_PUBLIC_`.

Para pasar a producción más adelante:

1. Verificar un dominio propio en Resend.
2. Cambiar `RESEND_FROM` por una dirección de ese dominio.
3. Eliminar `RESEND_TEST_RECIPIENT` de los secretos de la Edge Function.

Al no existir `RESEND_TEST_RECIPIENT`, la función enviará el comprobante al
correo validado que venga en cada formulario.

Para desarrollo local, copiar `supabase/functions/.env.example` como
`supabase/functions/.env.local`. El archivo local queda ignorado por Git.
También se pueden cargar esos secretos al proyecto enlazado sin exponerlos en
el historial de la terminal:

```bash
npx supabase secrets set --env-file supabase/functions/.env.local
```

### 2. Desplegar la Edge Function

Con Supabase CLI autenticado:

```bash
npx supabase functions deploy notify-recruitment --project-ref TU_PROJECT_REF
```

La configuración `verify_jwt = false` está versionada en
`supabase/config.toml` porque el llamador es un webhook y no una persona con
sesión. La función aplica su propia autenticación mediante
`x-webhook-secret`.

### 3. Configurar el Database Webhook

Ejecutar una vez desde PowerShell:

```powershell
.\supabase\configure-recruitment-webhook.ps1 -ProjectRef TU_PROJECT_REF
```

El script genera una clave aleatoria, la sincroniza con la Edge Function, la
guarda cifrada en Supabase Vault y aplica el trigger de `pg_net`. La clave no se
imprime ni se guarda en Git. El trigger se activa únicamente para estados
`pending` y `failed`; la función reclama cada notificación de forma atómica y
realiza como máximo tres intentos.

### 4. Verificar la entrega

Enviar un formulario y revisar:

```sql
select
  submission_type,
  submission_id,
  status,
  attempt_count,
  provider_message_id,
  last_error,
  created_at,
  sent_at
from public.recruitment_email_notifications
order by created_at desc;
```

Para reintentar manualmente una fila después de corregir una configuración:

```sql
update public.recruitment_email_notifications
set
  status = 'pending',
  attempt_count = 0,
  provider_message_id = null,
  last_error = null,
  processing_started_at = null,
  sent_at = null,
  updated_at = now()
where id = 'ID_DE_LA_NOTIFICACION';
```

El `UPDATE` vuelve a activar el webhook. Los roles públicos no pueden leer ni
modificar esta tabla.

## Desarrollo y despliegue

Después de crear `.env.local`, reiniciar `pnpm dev`. En el proveedor de
despliegue se deben crear las mismas variables `SUPABASE_URL` y
`SUPABASE_SECRET_KEY` como secretos de servidor y volver a desplegar.

Para una prueba completa:

1. Enviar una solicitud desde `/es/join`.
2. Verificar el mensaje de éxito en pantalla.
3. Confirmar la fila nueva desde **Table Editor** en Supabase.
4. Confirmar que la notificación llegue a estado `sent` y que se reciba el
   correo en `RESEND_TEST_RECIPIENT`, con `[PRUEBA]` en el asunto.
5. Comprobar que el navegador no recibe ni expone `SUPABASE_SECRET_KEY`.

## Módulos futuros

Galería, autenticación, panel administrativo, noticias y métricas todavía
requieren definir sus reglas funcionales antes de crear tablas o buckets. Cada
módulo debe agregar su propia migración, permisos RLS y documentación.
