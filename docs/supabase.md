# Supabase

Supabase sera el backend previsto para el proyecto. En esta etapa solo queda preparado a nivel de dependencias, cliente y variables de entorno; no se crean tablas, politicas RLS, buckets, autenticacion ni funciones finales.

## Variables

Las variables publicas esperadas son:

- `NEXT_PUBLIC_SUPABASE_URL`: URL publica del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: llave publica anonima para operaciones permitidas por las politicas de Supabase.

Estas variables deben copiarse en `.env.local` durante el desarrollo local. El archivo `.env.local` no debe versionarse.

## Cliente

La configuracion inicial vive en `lib/supabase/client.ts`. El cliente solo debe crearse cuando las variables esten definidas.

## Pendiente de configuracion

Antes de implementar modulos reales se debe definir:

- Esquema de tablas.
- Politicas Row Level Security.
- Roles y reglas de autenticacion.
- Buckets de almacenamiento para imagenes.
- Estrategia para metricas ambientales.
- Separacion de variables entre desarrollo, QA y produccion.

## Criterio para cambios futuros

Cada modulo que use Supabase debe documentar sus tablas, permisos, datos esperados y migraciones antes de pasar de `dev` a `qa`.
