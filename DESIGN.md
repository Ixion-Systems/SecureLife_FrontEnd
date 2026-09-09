# SecureLife • Design System & UI Architecture (DESIGN.md)

Este documento define la especificación oficial del **Sistema de Diseño (Design System)** de SecureLife, los tokens de marca en **Tailwind CSS v4**, la jerarquía tipográfica, el catálogo de componentes de interfaz y las directrices de animación e integración visual.

---

## 1. Filosofía e Identidad Visual

SecureLife transmite **confianza inquebrantable, modernidad tecnológica y agilidad digital**. Su estética combina la solidez del mundo asegurador tradicional con la frescura e interactividad de las aplicaciones Fintech/Insurtech de última generación.

### Principios Fundamentales
1. **Claridad Inmediata:** Interfaces limpias con fondos ultra-claros, alto contraste tipográfico y eliminación de ruido visual.
2. **Profundidad con Glassmorphism Sutil:** Superficies translúcidas con desenfoque de fondo (*backdrop-blur*) que aportan sofisticación sin saturar la GPU.
3. **Fluidez Cinemática a 60fps:** Microinteracciones reactivas gobernadas por GSAP y Tailwind, animando exclusivamente propiedades aceleradas por hardware (`transform`, `opacity`).
4. **Consistencia de Tokens:** Cero clases CSS arbitrarias (`bg-[#123456]`). Toda decisión cromática o espacial está sujeta a los tokens centrales de `@theme`.

---

## 2. Tokens de Color Corporativos (Tailwind CSS v4)

Definidos en `src/index.css` mediante la directiva moderna `@theme`:

```css
@theme {
  /* Paleta Primaria Institucional */
  --color-brand-primary: #006e2f;        /* Verde corporativo principal */
  --color-brand-primary-dark: #005321;   /* Verde bosque profundo para gradientes y contrastes */
  --color-brand-accent: #22c55e;         /* Verde esmeralda vibrante para brillos y CTAs */
  --color-brand-accent-light: #4ade80;   /* Verde menta suave para halos y loaders */
  --color-brand-dark: #0b1c30;           /* Azul petróleo ultra-profundo para textos de alto contraste */
  --color-brand-surface: #f8f9ff;        /* Fondo base de página con matiz frío limpio */

  /* Glassmorphism & Transparencias */
  --color-glass-white: rgba(255, 255, 255, 0.85);
  --color-glass-border: rgba(255, 255, 255, 0.90);
  --color-glass-backdrop: rgba(11, 28, 48, 0.65);
}
```

### Tabla de Aplicación de Color

| Token | Color | Hex | Uso en la Interfaz |
| :--- | :---: | :---: | :--- |
| **`brand-primary`** | ![#006e2f](https://via.placeholder.com/15/006e2f/000000?text=+) | `#006e2f` | Botones principales, enlaces destacados, acentos de títulos |
| **`brand-accent`** | ![#22c55e](https://via.placeholder.com/15/22c55e/000000?text=+) | `#22c55e` | Marco líquido de la Navbar, badges de éxito, glows interactivos |
| **`brand-dark`** | ![#0b1c30](https://via.placeholder.com/15/0b1c30/000000?text=+) | `#0b1c30` | Tipografía de títulos H1/H2/H3, encabezados de tarjeta, textos primarios |
| **`brand-surface`** | ![#f8f9ff](https://via.placeholder.com/15/f8f9ff/000000?text=+) | `#f8f9ff` | Fondo general de la aplicación (`body`) |

---

## 3. Jerarquía Tipográfica

El sistema tipográfico combina 3 familias complementarias cargadas desde Google Fonts en `index.html`:

```text
Google Sans Flex -> Títulos, números grandes y llamados de alto impacto
Outfit           -> Subtítulos, métricas, badges y labels de formularios
Lexend           -> Cuerpo de texto general, inputs, tablas y botones
```

### Clases de Utilidad
* **`font-title` (`Google Sans Flex`):**
  * `text-4xl` a `text-6xl`, `font-black`, `tracking-tight`, `leading-[1.12]`.
  * Utilizado en el titular del Hero, títulos de sección y prima mensual grande.
* **`font-subtitle` (`Outfit`):**
  * `text-base` a `text-xl`, `font-semibold` o `font-medium`, `tracking-wide`.
  * Utilizado en bajadas de títulos, badges y etiquetas de campos.
* **`font-body` (`Lexend`):**
  * `text-xs` a `text-sm`, `font-normal` o `font-light`, `leading-relaxed`.
  * Utilizado en párrafos descriptivos, descripciones de cobertura y controles.

---

## 4. Estándar de Componentes Reciclables (`src/components/ui/`)

Todo componente visual del proyecto expone un contrato universal de props para garantizar reutilización total:

```typescript
export interface BaseUIProps {
  variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  width?: string;
  height?: string;
  className?: string;
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

### Componentes Core Implementados
1. **`Button` ([`src/components/ui/Button.tsx`](./src/components/ui/Button.tsx)):**
   * Soporta variantes `primary` (gradiente verde), `glass` (fondo translúcido), `outline` y `ghost`.
   * Incluye propiedad booleana `glow` para efecto de iluminación reactiva.
2. **`Card` ([`src/components/ui/Card.tsx`](./src/components/ui/Card.tsx)):**
   * Variantes `glass-surface`, `glass-card`, `white` y `flat`.
   * Bordes translúcidos con desenfoque de fondo y sombras suaves anti-aliasing.
3. **`Badge` ([`src/components/ui/Badge.tsx`](./src/components/ui/Badge.tsx)):**
   * Insignias de categoría y estado (`primary`, `secondary`, `glass`).
4. **`Input` ([`src/components/ui/Input.tsx`](./src/components/ui/Input.tsx)):**
   * Entradas con slots para iconos izquierdos/derechos, estados de error validados por Zod y textos de ayuda (*helperText*).

---

## 5. Coreografía y Animaciones (GSAP 3+ & Canvas)

Las animaciones del proyecto están gobernadas por GSAP y WebGL/2D Canvas nativos:

1. **Marco Líquido Continuo (`Navbar.tsx`):**
   * Un indicador redondeado continuo se desplaza dinámicamente sobre la barra de navegación entre `#hero`, `#servicios`, `#sobre-nosotros` y `#cotizador` mediante transformaciones CSS GPU (`translateX`), sin parpadeos ni reinicios.
2. **Ondas Sinusoidales (`WaveCanvas.tsx`):**
   * Tres capas de ondas matemáticas en tonos esmeralda animadas en la sección de Servicios.
3. **Constelación Geométrica (`GeometryCanvas.tsx`):**
   * Red de partículas interconectadas con repulsión al cursor en la sección de Sobre Nosotros.
4. **Fondo Ambiental del Cotizador (`CotizadorAmbientCanvas.tsx`):**
   * Nodos pulsantes y ondas armónicas esmeralda que iluminan la tarjeta del cotizador.
5. **Loader de Apertura Táctil (`PageIntroLoader.tsx`):**
   * Secuencia de desbloqueo cinemático con GSAP (expansión de rectángulos y apertura del candado) que libera el scroll tras su finalización.

---

## 6. Protocolo de Ingesta desde Google Stitch AI / Figma

Al convertir pantallas de Google Stitch AI o maquetas de Figma a código React:
1. **Auditoría Previa:** Revisar siempre `src/components/ui/` antes de escribir un nuevo botón, tarjeta o input.
2. **Reemplazo Obligatorio:** Todo `<button>`, `<input>` o `<div class="card...">` de Stitch debe reemplazarse por `<Button>`, `<Input>` o `<Card>` del Design System.
3. **Tipado Estricto:** Tipar todas las props con TypeScript y validar entradas con esquemas Zod.
4. **Preservación de Tokens:** Descartar clases CSS arbitrarias generadas por IA y reemplazarlas por los tokens corporativos.
