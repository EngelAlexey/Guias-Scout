# Propuesta TCU

## Resumen

El proyecto propone construir un sitio web para el Grupo 35 de Guias y Scouts como apoyo al trabajo comunal universitario. La base tecnica debe permitir publicar informacion institucional, registrar contenido relevante del grupo y preparar futuras herramientas digitales para gestion, comunicacion y seguimiento de iniciativas ambientales.

## Objetivo general

Crear una plataforma web mantenible que sirva como punto de informacion y soporte operativo para el Grupo 35 de Guias y Scouts.

## Alcance actual

Esta etapa solo inicializa el repositorio:

- Aplicacion base con Next.js, TypeScript y App Router.
- Supabase definido como backend previsto.
- Variables de entorno documentadas.
- Estructura minima para componentes reutilizables y documentacion tecnica.
- Reglas de colaboracion y ramas principales.

## Alcance futuro

Los siguientes modulos quedan fuera de esta etapa inicial y se implementaran en tareas posteriores:

- Autenticacion y roles.
- Panel administrativo. **Queda fuera del TCU por decision explicita** (10.3): el mantenimiento posterior se resuelve con documentacion y capacitacion. Ver [`mantenimiento.md`](./mantenimiento.md).
- Galeria o almacenamiento de imagenes.
- Formularios publicos o internos.
- Registro y consulta de metricas ambientales.
- Tablas, politicas RLS y reglas de almacenamiento en Supabase.

## Criterio de exito inicial

La base se considera lista cuando el proyecto instala dependencias, compila, inicia el servidor de desarrollo y cuenta con documentacion suficiente para que el equipo pueda continuar el desarrollo sin trabajar directamente sobre `main`.

## Entrega al grupo

Al cerrar el TCU el sitio queda a cargo de Comunicacion y Tecnologia del Grupo 35. La entrega incluye permiso de escritura en el repositorio, la guia [`guia-de-edicion.md`](./guia-de-edicion.md) y una sesion de capacitacion sobre ella.
