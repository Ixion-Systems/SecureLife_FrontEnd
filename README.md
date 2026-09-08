<div align=center>
  <img src=public/LOGO+TEXT_GREEN.svg width=260 alt=SecureLife Logo />
  
  # SecureLife • Frontend Platform
  
  <p align=center>
    <strong>Plataforma Insurtech de clase mundial para asegurados: cotización multirramo, inspección pericial digital, gestión de pólizas y auxilio mecánico 24/7.</strong>
  </p>

  <p align=center>
    <a href=#inicio-rápido>Inicio Rápido</a> •
    <a href=#arquitectura-feature-based>Arquitectura</a> •
    <a href=#módulos-y-capacidades>Módulos</a> •
    <a href=./DESIGN.md>Design System (DESIGN.md)</a> •
    <a href=#scripts-disponibles>Comandos</a> •
    <a href=#seguridad-y-sesión>Seguridad</a> •
    <a href=#licencia>Licencia</a>
  </p>

  <p align=center>
    <img src=https://img.shields.io/badge/Sprint-2_Active-006E2F?style=for-the-badge&logo=git&logoColor=white alt=Sprint 2 />
    <img src=https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB alt=React 19 />
    <img src=https://img.shields.io/badge/TypeScript_5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white alt=TypeScript 5.9 />
    <img src=https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white alt=Vite 8 />
    <img src=https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white alt=Tailwind CSS v4 />
    <img src=https://img.shields.io/badge/GSAP_Motion-88CE02?style=for-the-badge&logo=greensock&logoColor=black alt=GSAP Motion />
    <img src=https://img.shields.io/badge/Validation-Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white alt=Zod />
    <img src=https://img.shields.io/badge/Zero-LocalStorage-22C55E?style=for-the-badge&logo=securityscorecard&logoColor=white alt=Zero LocalStorage />
  </p>
</div>

---

## 📖 Resumen del Proyecto

**SecureLife Frontend** es la aplicación web para asegurados y cotizantes de SecureLife. Construida bajo los principios de **React Clean Architecture (Feature-Based)** y optimizada para el motor V8, combina una estética cinemática moderna con validaciones estrictas y conexión directa a la base de datos relacional PostgreSQL 16 mediante Stored Procedures.

> [!TIP]
> **Sprint 2 Entregado:** Incorporación del Dashboard de Asegurados con métricas 100% reales, autenticación Split-Screen Solara, modal selector multirramo, cotizador dual de vehículos (Catálogo ACARA vs. Revisión Extensa), cotizador integral de hogar e inmuebles con cálculo actuarial en vivo, y erradicación total de localStorage en favor de sessionStorage.

---

## 🚀 Módulos y Capacidades del Sistema

### 1. 🛡️ Dashboard de Asegurados (/dashboard)
* **Métricas Reales por Stored Procedures:** Cero datos inventados o hardcodeados; consume vistas de PostgreSQL (w_client_dashboard_summary, w_active_policies_detailed, w_client_activity_feed).
* **Pólizas Activas en Detalle:** Tarjetas interactivas con coberturas, patentes, direcciones, carnet digital y botón prioritario para pedir grúa.
* **Auxilio Mecánico Satelital 24/7:** Valida estrictamente en base de datos la tenencia de una póliza activa del ramo automotor antes de autorizar la solicitud.
* **Empty States Guiados:** Mensajes orientados al usuario cuando no registra contratos (No posee pólizas activas, contrate una aquí).

### 2. 🔐 Autenticación Split-Screen Solara (/login & /signup)
* **Identificador Dual:** Inicio de sesión habilitado tanto por **correo electrónico** como por **número de DNI** argentino (7-8 dígitos numéricos).
* **Protección de Rutas (ProtectedRoute):** Redirección inmediata al /login si un usuario intenta ingresar a rutas protegidas sin un token activo.
* **Cero localStorage:** Manejo de sesión efímera en sessionStorage mediante el servicio uthStorage.ts.

### 3. 🚗 Cotizador de Automotores (Wizard en 4 Pasos)
* **Doble Flujo de Cotización:**
  * **Catálogo Oficial (ACARA):** Tasación automática mediante sp_calcular_cotizacion_auto con precio preliminar estimado en pantalla.
  * **Carga Manual (Revisión Extensa):** Para vehículos clásicos, especiales o importados no homologados, con valor declarado y derivación a peritaje.
* **Inspección Digital Obligatoria:** Carga de 7 fotos perimetrales (frente y trasera con patente, laterales, parabrisas/techo, odómetro, neumáticos) y 3 documentos legales (cédula verde frente/dorso y licencia de conducir).

### 4. 🏠 Cotizador de Hogar e Inmuebles (HOGAR_INMUEBLE)
* **Tipología y Ubicación:** Selección entre Casa, Departamento, PH, Country o Local Comercial con sugerencia automática de valor de reposición (\.000 ARS/m²).
* **Medidas de Seguridad con Bonificación:** Descuento directo en prima por alarma monitoreada (-10%) y rejas perimetrales (-5%).
* **Inspección Digital del Inmueble:** Carga interactiva de fotos de fachada exterior con número municipal, cerraduras/rejas, panel de alarma y título de propiedad.

### 5. 🎯 Cotizador Demostrativo en Landing Page
* Modo **DEMO** oficial para usuarios no registrados con simulación transparente y derivación a registro formal sin cobros ficticios.

---

## 🏛️ Arquitectura Feature-Based

`mermaid
graph TD
    subgraph UI [Capa de Presentación]
        LANDING[LandingPage\n(Hero, Canvas, Demo)]
        AUTH[Auth Module\n(LoginPage, SignUpPage, Split-Screen)]
        DASH[DashboardPage\n(Métricas, Pólizas, Timeline)]
        WIZARDS[Wizards Flotantes\n(CotizacionAutoModal, CotizacionInmuebleModal)]
    end

    subgraph Domain [Capa de Lógica & Hooks]
        USE_DASH[useDashboardData\n(Promise.allSettled)]
        USE_AUTO[useCotizacionAutoWizard]
        USE_INMUEBLE[useCotizacionInmueble]
        AUTH_STORAGE[authStorage (sessionStorage)]
    end

    subgraph API [Capa de Integración HTTP]
        DASH_API[dashboardApi.ts]
        AUTO_API[cotizacionesAutoApi.ts]
        INM_API[cotizacionInmuebleApi.ts]
    end

    subgraph Server [Backend REST (Port 3000)]
        EXPRESS[Express API /api/v1/*]
    end

    DASH --> USE_DASH
    WIZARDS --> USE_AUTO
    WIZARDS --> USE_INMUEBLE
    AUTH --> AUTH_STORAGE
    USE_DASH --> DASH_API
    USE_AUTO --> AUTO_API
    USE_INMUEBLE --> INM_API
    DASH_API --> EXPRESS
    AUTO_API --> EXPRESS
    INM_API --> EXPRESS
`

### Estructura del Código Fuente
`	ext
src/
├── components/
│   ├── ui/                   # Componentes atómicos (Button, Input, Card, Badge, BrandLogo)
│   ├── layout/               # Navbar con marco líquido y Footer
│   └── animations/           # Canvas interactivos y transiciones cinemáticas GSAP
├── features/
│   ├── auth/                 # Módulo de Autenticación (Login, Signup, authStorage, schemas)
│   ├── landing/              # Landing Page pública y cotizador demo
│   ├── cotizador/            # Simulador paramétrico para landing
│   └── dashboard/            # Portal privado del Asegurado
│       ├── components/       # MetricCard, PolicyCard, RecentActivity, SelectAssetModal
│       ├── components/cotizacion-auto/     # Wizard de 4 pasos Automotor
│       ├── components/cotizacion-inmueble/ # Wizard de 4 pasos Inmuebles
│       ├── hooks/            # useDashboardData con Promise.allSettled
│       ├── services/         # Consumo tipado de la API REST
│       └── pages/            # DashboardPage.tsx
├── types/                    # Contratos de tipos globales
└── index.css                 # Configuración Tailwind CSS v4 (@theme tokens)
`

---

## ⚡ Inicio Rápido

### Prerrequisitos
* **Node.js:** >= 20.0.0
* **npm:** >= 10.0.0
* **Backend:** SecureLife_BackEnd ejecutándose en http://localhost:3000.

### 1. Clonar el Repositorio
`ash
git clone https://github.com/Ixion-Systems/SecureLife_FrontEnd.git
cd SecureLife_FrontEnd
`

### 2. Cambiar a la Rama del Sprint 2
`ash
git checkout sprint2
`

### 3. Instalar Dependencias
`ash
cmd /c npm install
`

> [!NOTE]
> En entornos **Windows PowerShell**, invoca las utilidades anteponiendo cmd /c para evitar bloqueos por PSSecurityException.

### 4. Iniciar Servidor de Desarrollo
`ash
cmd /c npm run dev
`
La aplicación se iniciará en http://localhost:5173/.

### 5. Compilar para Producción
`ash
cmd /c npm run build
`
Genera el bundle optimizado en dist/ validando tipos con 	sc -b.

---

## 🎨 Design System & Tokens

La identidad corporativa está gobernada por Tailwind CSS v4 en src/index.css:

| Token | Color | Hex | Aplicación |
| :--- | :---: | :---: | :--- |
| --color-primary | ![#006e2f](https://via.placeholder.com/15/006e2f/000000?text=+) | #006e2f | Verde corporativo para botones, cabeceras e isotipo |
| --color-accent | ![#22c55e](https://via.placeholder.com/15/22c55e/000000?text=+) | #22c55e | Verde esmeralda para halos líquidos, bordes activos y badges |
| --color-surface | ![#f8f9ff](https://via.placeholder.com/15/f8f9ff/000000?text=+) | #f8f9ff | Fondo base ultra-limpio con matiz frío |
| --color-dark | ![#0b1c30](https://via.placeholder.com/15/0b1c30/000000?text=+) | #0b1c30 | Azul petróleo de alto contraste |

* **Fuentes:** *Google Sans Flex* (Títulos), *Outfit* (Subtítulos/Badges), *Lexend* (Cuerpo/Formularios).

---

## 📋 Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| cmd /c npm run dev | Inicia el servidor de desarrollo Vite con Hot Module Replacement (HMR). |
| cmd /c npm run build | Compila TypeScript (	sc -b) y empaqueta la aplicación para producción. |
| cmd /c npm run preview | Previsualiza localmente el build generado en dist/. |
| cmd /c npm run lint | Ejecuta el análisis estático ultra-rápido de Oxlint sobre el proyecto. |

---

## 🛡️ Seguridad y Sesión

* **Erradicación de localStorage:** Los tokens JWT y datos de perfil se conservan en sessionStorage, impidiendo la persistencia de credenciales tras cerrar la pestaña del navegador.
* **Control de Inactividad:** Si un endpoint responde con código 401 Unauthorized, el cliente purga inmediatamente la sesión y redirige a la vista de login.
* **Sanitización de Formularios:** Validación preventiva estricta con Zod en cada paso de los Wizards antes del envío al backend.

---

## 📄 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo LICENSE para más información.
