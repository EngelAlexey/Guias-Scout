# Verificación de Accesibilidad y Rendimiento

Este documento registra la verificación formal de accesibilidad (WCAG 2.1 AA) y rendimiento (Core Web Vitals) realizada antes de la publicación del sitio web del Grupo 35 de Guías y Scouts de Costa Rica.

---

## 1. Accesibilidad (WCAG 2.1 AA)

### 1.1 Contraste de Color en Secciones (`data-seccion`)

Todos los colores de sección definidos en `app/globals.css` fueron evaluados en relación con el fondo general (`--cream` `#FAF8F3` / `--surface` `#FFFFFF`):

| Secciones | Token / Color | Texto / Acento Fuerte | Fondo Suave | Ratio de Contraste | Cumplimiento WCAG |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Manada** | `#F4B400` | `#8A6508` | `#FEF3D9` | **5.35:1** (sobre `#FFFFFF`) / **7.80:1** (badge sobre `#F4B400`) | AA / AAA |
| **Tropa** | `#43A047` | `#20613C` | `#E8F3EC` | **7.47:1** (sobre `#FFFFFF`) | AAA |
| **Wak** | `#1E88E5` | `#0F4C87` | `#E3F0FB` | **8.85:1** (sobre `#FFFFFF`) | AAA |
| **Comunidad** | `#E53935` | `#9E2020` | `#FCE4E3` | **7.95:1** (sobre `#FFFFFF`) | AAA |

*Nota:* Para la sección Manada, se utiliza el token `--acento-fuerte` (`#8A6508`) para los elementos de texto en lugar del amarillo directo `#F4B400`, garantizando que supere el umbral mínimo de 4.5:1 exigido por WCAG AA.

---

### 1.2 Navegación por Teclado

- **Enlace de salto ("Skip to content"):** Presente antes del encabezado (`#content`). Al presionar `Tab`, se visibiliza en la esquina superior izquierda con anillo de foco ambar de 3px.
- **Foco visible (`:focus-visible`):** Aplicado a todos los elementos interactivos (`<a>`, `<button>`, `<input>`, `<select>`, `<textarea>`) usando un anillo de 3px (`--amber` `#F2A900`).
- **Navegación móvil (`< 980px`):** El botón de menú desplegable es accionable por teclado mediante `Enter` y `Espacio`.
- **Formularios de contacto e inscripción (`/join`):** Navegables secuencialmente con `Tab` y `Shift + Tab`.

---

### 1.3 Lector de Pantalla y Estructura Semántica

- **Atributo de idioma:** `<html lang="es">` sincronizado automáticamente con el idioma activo mediante `next-intl`.
- **Estructura Hn:** Único `<h1>` por página, seguido jerárquicamente por `<h2>` y `<h3>`.
- **Navegación activa:** Los enlaces activos incluyen `aria-current="page"`.
- **Tablas de datos (`/sections`):** Encabezados con `<th scope="col">` y atributos `data-label` para lectura clara en dispositivos móviles.
- **Movimiento reducido:** Toda animación y revelado por scroll se encapsulan dentro de `@media (prefers-reduced-motion: no-preference)`.

---

## 2. Rendimiento y Core Web Vitals

| Métrica | Objetivo | Estrategia y Optimización Aplicada | Estado |
| :--- | :--- | :--- | :--- |
| **LCP** *(Largest Contentful Paint)* | `< 2.5s` | Fuentes Sora y Mulish cargadas localmente con `next/font/google` sin FOUT ni dependencias externas. El título principal `.hero__title` no retrasa su renderizado ni opacidad. | Verificado |
| **CLS** *(Cumulative Layout Shift)* | `< 0.1` | Layouts y contenedores estáticos. Uso de componentes con dimensiones explícitas (ej. `BrandMark` para el logo en `public/logo.webp`). | Verificado |
| **INP / FID** *(Interaction to Next Paint)* | `< 200ms` | Rendimiento impulsado por Server Components y middleware de internacionalización de Next.js sin cargas innecesarias de JS en el cliente. | Verificado |

---

## 3. Comandos de Validación Local

Antes de integrar cambios a las ramas `qa` o `main`, ejecutar:

```bash
npm run typecheck
npm run build
```

Ambos comandos se ejecutan sin errores ni advertencias de compilación.
