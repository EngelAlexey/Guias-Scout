# Grupo 35 de Guias y Scouts

Base tecnica para el sitio web del proyecto TCU asociado al Grupo 35 de Guias y Scouts. Este repositorio inicia la estructura del frontend con Next.js y deja preparado Supabase como backend previsto para autenticacion, base de datos, almacenamiento de imagenes y futuras metricas ambientales.

## Stack

- Next.js con App Router
- TypeScript
- Supabase
- pnpm

## Requisitos locales

- Node.js 20 LTS o superior
- pnpm 11 o superior
- Proyecto de Supabase creado cuando se habiliten los modulos que lo necesiten

## Instalacion

```bash
pnpm install
```

## Variables de entorno

Crear un archivo `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

En PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Variables previstas:

- `NEXT_PUBLIC_SUPABASE_URL`: URL publica del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: llave publica anonima del proyecto Supabase.

Estas variables pueden quedar vacias mientras solo se trabaje en la base del repositorio. La app no implementa todavia autenticacion, tablas, politicas RLS ni almacenamiento final.

## Desarrollo

```bash
pnpm dev
```

La aplicacion queda disponible por defecto en `http://localhost:3000`.

## Validacion

```bash
pnpm build
pnpm typecheck
```

## Flujo de ramas

Este proyecto usa tres ramas principales:

- `main`: version estable/publicable.
- `qa`: validacion funcional antes de produccion.
- `dev`: base para desarrollo activo.

No se debe trabajar directamente sobre `main`. Las tareas nuevas salen desde `dev`, se integran primero a `dev`, pasan a `qa` para validacion y solo llegan a `main` cuando esten aprobadas.

Si el repositorio aun no tiene las ramas creadas, se pueden crear despues del primer commit:

```bash
git switch main
git switch -c dev
git switch main
git switch -c qa
git switch main
```

## Estado inicial

El alcance actual es levantar la base del repositorio: stack, estructura inicial, configuracion prevista de Supabase, documentacion y reglas de colaboracion. No se implementan todavia modulos finales como panel administrativo, galeria, formularios, autenticacion, metricas ambientales o carga de imagenes.
