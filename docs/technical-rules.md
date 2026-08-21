# Reglas tecnicas

## Alcance de esta base

El repositorio contiene solamente la base tecnica del proyecto. No se deben agregar modulos finales sin una tarea definida y revisada.

## Ramas principales

- `main`: version estable/publicable.
- `qa`: rama de validacion antes de produccion.
- `dev`: rama base para desarrollo activo.

No se debe trabajar directamente sobre `main`.

Si el repositorio aun no tiene `dev` y `qa`, se deben crear despues del primer commit desde el mismo punto base:

```bash
git switch main
git switch -c dev
git switch main
git switch -c qa
git switch main
```

## Flujo de trabajo

1. Crear tareas nuevas desde `dev`.
2. Integrar cambios primero a `dev`.
3. Pasar cambios validados de `dev` a `qa`.
4. Promover a `main` solo lo aprobado desde `qa`.

## Convenciones de desarrollo

- Usar TypeScript en modo estricto.
- Mantener componentes reutilizables en `components/`.
- Mantener configuraciones compartidas en `lib/`.
- Documentar decisiones tecnicas relevantes en `docs/`.
- Mantener `.env.example` alineado con las variables requeridas.
- No versionar `.env.local` ni secretos.
- Preferir cambios pequenos y revisables.

## Supabase

Supabase se usa como backend previsto, pero las tablas, politicas RLS, buckets y autenticacion se implementaran en tareas futuras. Ningun cambio que dependa de datos reales debe avanzar a `qa` sin documentacion tecnica y validacion local.

## Validacion antes de integrar

Antes de abrir o fusionar cambios se debe ejecutar:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

Las pruebas deben mantenerse alineadas con los contratos de contenido y correr
antes de integrar cualquier cambio. El workflow de CI ejecuta estas cuatro
validaciones en cada pull request hacia `dev`, `qa` y `main`.
