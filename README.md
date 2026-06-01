<![CDATA[<div align="center">

# 📘 Manual Digital Docente

**Plataforma web para el registro de conformidad docente del ecosistema educativo CIIP Latam, Geomina y Biomedic.**

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-≥20.19-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/Licencia-Privado-red?style=for-the-badge)](#)

🌐 **Producción:** [docentesglobal.vercel.app](https://docentesglobal.vercel.app)

</div>

---

## 📑 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características Principales](#-características-principales)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Flujo del Onboarding](#-flujo-del-onboarding)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Comandos Disponibles](#-comandos-disponibles)
- [API Endpoints](#-api-endpoints)
- [Despliegue](#-despliegue)
- [Seguridad](#-seguridad)
- [Contribución](#-contribución)

---

## 📋 Descripción

**Manual Digital Docente** es una aplicación web construida con **Next.js 15** y **React 19** que digitaliza el proceso de inducción y registro de conformidad para docentes del ecosistema educativo conformado por tres marcas:

| Marca | Enfoque |
|-------|---------|
| **CIIP Latam** | Capacitación profesional en ingeniería |
| **Geomina** | Formación en minería y geociencias |
| **Biomedic** | Educación en salud y biomedicina |

La plataforma guía al docente a través de un wizard interactivo de múltiples pasos donde revisa el manual operativo, registra sus datos personales, firma digitalmente su conformidad y envía la confirmación vía WhatsApp a su coordinador académico.

---

## ✨ Características Principales

- 🧙‍♂️ **Wizard de Onboarding** — Formulario guiado de múltiples pasos con validación en tiempo real.
- 🔍 **Consulta de DNI** — Integración con API RENIEC para autocompletar datos del docente.
- 📄 **Generación de PDF** — Documento de conformidad generado en el navegador con `@react-pdf/renderer`.
- 📊 **Google Sheets** — Almacenamiento automático de datos en hojas de cálculo compartidas.
- 📁 **Google Drive** — Subida de CV, foto de perfil y PDF de conformidad a carpetas organizadas.
- 💬 **WhatsApp** — Generación de mensaje de confirmación prellenado para el coordinador.
- 🏆 **Programa Docente TOP** — Visualización de métricas y ranking de desempeño docente.
- 📱 **100% Responsivo** — Diseño adaptado para móviles, tablets y escritorio.
- 🎨 **Multi-marca** — Interfaz dinámica que se adapta a los colores y logos de cada institución.

---

## 🏗 Arquitectura del Proyecto

```
Docentes/
├── public/
│   ├── assets/              # Logos e imágenes de marcas
│   ├── videos/              # Video de mascota animada
│   ├── favicon.svg
│   ├── icons.svg            # Sprite de iconos SVG
│   └── robots.txt
│
├── scripts/
│   ├── patch-next-webpack-loaders.cjs   # Patch de compatibilidad con Next.js
│   ├── verify-integrations.mjs          # Verificación de APIs de Google
│   ├── google-oauth-url.mjs             # Generación de URL de autorización OAuth
│   └── google-oauth-token.mjs           # Intercambio de código por refresh token
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── reniec/route.js          # API de consulta DNI
│   │   │   └── submit/route.js          # API de envío del formulario
│   │   ├── layout.jsx                   # Layout raíz con metadata SEO
│   │   ├── page.jsx                     # Página principal
│   │   └── globals.css                  # Estilos globales
│   │
│   ├── components/
│   │   ├── OnboardingWizard.jsx         # Wizard principal (12 pasos)
│   │   ├── Hero.jsx                     # Sección hero de la landing
│   │   ├── Horarios.jsx                 # Horarios de entrega
│   │   ├── Filosofia.jsx                # Filosofía institucional
│   │   ├── Protocolos.jsx               # Protocolos operativos
│   │   ├── DocenteTop.jsx               # Dashboard Docente TOP
│   │   ├── Conformidad.jsx              # Sección de conformidad
│   │   ├── Logos.jsx                    # Componente de logos
│   │   ├── Navbar.jsx                   # Barra de navegación
│   │   └── Footer.jsx                   # Pie de página
│   │
│   ├── lib/
│   │   ├── google-auth.js               # Autenticación con Google APIs
│   │   ├── google-drive.js              # Operaciones con Google Drive
│   │   ├── google-sheets.js             # Operaciones con Google Sheets
│   │   └── request-security.js          # Validaciones de seguridad
│   │
│   └── utils/
│       ├── emailValidation.js           # Validación de emails
│       └── emailValidation.test.js      # Tests de validación
│
├── .env.example                         # Plantilla de variables de entorno
├── next.config.mjs                      # Configuración de Next.js
├── nixpacks.toml                        # Configuración de despliegue
├── package.json
└── eslint.config.js
```

---

## 🔄 Flujo del Onboarding

El wizard guía al docente a través de los siguientes pasos:

```mermaid
flowchart TD
    A[1. Selección de Institución] --> B[2. Consulta de DNI]
    B --> C[3. Datos Personales]
    C --> D[4. Filosofía Institucional]
    D --> E[5. Protocolos Operativos]
    E --> F[6. Horarios de Entrega]
    F --> G[7. Métricas de Desempeño]
    G --> H[8. Programa Docente TOP]
    H --> I[9. Subida de Documentos]
    I --> J[10. Revisión y Resumen]
    J --> K[11. Firma Digital]
    K --> L[12. Confirmación y WhatsApp]

    style A fill:#0ea5e9,color:#fff
    style L fill:#059669,color:#fff
```

---

## 🛠 Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **UI** | React 19 |
| **PDF** | @react-pdf/renderer |
| **Validación** | Zod v4 |
| **APIs Google** | googleapis (Sheets + Drive) |
| **Linting** | ESLint 9 |
| **Tipografías** | Outfit, Manrope, Plus Jakarta Sans, Sora (Google Fonts) |
| **Deploy** | Vercel / Nixpacks |

---

## 📦 Requisitos Previos

- **Node.js** ≥ 20.19.0
- **npm** ≥ 10
- Cuenta de servicio de Google con acceso a:
  - Google Sheets API
  - Google Drive API
- Token de API RENIEC (para consulta de DNI)

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/milith0kun/DocentesGlobal.git
cd DocentesGlobal

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales (ver sección siguiente)

# 4. Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 🔐 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

### Google Sheets y Drive (Cuenta de Servicio)

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-cuenta@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_SPREADSHEET_ID=id_de_tu_hoja_de_calculo
GOOGLE_SHEET_GID=gid_de_la_pestaña         # Opcional: pestaña específica
GOOGLE_DRIVE_ROOT_FOLDER_ID=id_carpeta_raiz
GOOGLE_DRIVE_CV_FOLDER_ID=id_carpeta_cv     # Opcional: carpeta específica para CVs
GOOGLE_DRIVE_FOTO_FOLDER_ID=id_carpeta_foto # Opcional: carpeta específica para fotos
```

> **Nota:** La cuenta de servicio debe tener permisos de **editor** sobre la hoja de cálculo y la carpeta raíz de Drive. Si no se define `GOOGLE_SHEET_GID`, se puede usar `GOOGLE_SHEET_NAME` o por defecto se usará la pestaña `Docentes`.

### Google Drive (OAuth — para carpetas de "Mi unidad")

Si necesitas subir archivos a una carpeta personal de Google Drive (no compartida con cuenta de servicio):

```env
GOOGLE_OAUTH_CLIENT_ID=tu_client_id
GOOGLE_OAUTH_CLIENT_SECRET=tu_client_secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/oauth2callback
GOOGLE_OAUTH_REFRESH_TOKEN=tu_refresh_token
```

**Para obtener el refresh token:**

```bash
# 1. Generar URL de autorización
npm run google:oauth:url

# 2. Autorizar en el navegador con la cuenta dueña de Drive

# 3. Copiar el parámetro "code" de la URL final y ejecutar:
npm run google:oauth:token -- "CODIGO_DE_GOOGLE"

# 4. Copiar el refresh_token resultante a .env.local
```

### API RENIEC

```env
RENIEC_API_TOKEN=tu_token_de_consulta_dni
```

### Opcionales

```env
GOOGLE_DRIVE_PUBLIC_UPLOADS=true   # Hacer públicos los archivos subidos a Drive
```

---

## 💻 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:3000` |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta ESLint sobre todo el proyecto |
| `npm run verify:integrations` | Verifica la conexión con Google Sheets y Drive |
| `npm run google:oauth:url` | Genera la URL de autorización OAuth |
| `npm run google:oauth:token -- "CODE"` | Intercambia un código OAuth por un refresh token |
| `node --test src/utils/emailValidation.test.js` | Ejecuta los tests de validación de email |

---

## 🌐 API Endpoints

### `POST /api/reniec`

Consulta datos de un ciudadano peruano por su número de DNI.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `dni` | `string` | Número de DNI (8 dígitos) |

**Respuesta exitosa:**
```json
{
  "nombre": "JUAN CARLOS PEREZ GARCIA",
  "dni": "12345678"
}
```

---

### `POST /api/submit`

Envía el formulario completo de conformidad docente. Acepta `multipart/form-data`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `marca` | `string` | Institución (`ciip`, `geomina`, `biomedic`) |
| `dni` | `string` | DNI del docente |
| `nombre` | `string` | Nombre completo |
| `email` | `string` | Correo electrónico |
| `telefono` | `string` | Número de teléfono |
| `profesion` | `string` | Profesión del docente |
| `cv` | `File` | Archivo PDF del CV |
| `foto` | `File` | Fotografía de perfil |
| `firma` | `string` | Firma digital (base64) |

**Respuesta exitosa:**
```json
{
  "code": "CIIP-20260601-ABC12",
  "message": "Conformidad registrada exitosamente"
}
```

---

## 🚢 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub con [Vercel](https://vercel.com).
2. Configura las variables de entorno en el panel de Vercel.
3. Cada push a `main` desplegará automáticamente.

### Nixpacks / Railway

El proyecto incluye un archivo `nixpacks.toml` preconfigurado:

```toml
[phases.setup]
nixPkgs = ["nodejs_22"]

[phases.install]
cmds = ["npm install --legacy-peer-deps"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run start"
```

---

## 🔒 Seguridad

- **Validación en servidor:** La API `/api/submit` valida todos los campos obligatorios, tipos y tamaños de archivos en el servidor. Esta validación es crítica porque las validaciones del lado del cliente pueden ser eludidas.
- **Sanitización de entrada:** Los datos se sanitizan antes de ser almacenados en Google Sheets.
- **Variables sensibles:** Todas las credenciales se manejan exclusivamente a través de variables de entorno y nunca se incluyen en el repositorio.
- **Archivos privados:** Por defecto, los archivos subidos a Google Drive **no** se publican con acceso público.

---

## 🤝 Contribución

1. Haz un fork del repositorio.
2. Crea una rama para tu feature: `git checkout -b feature/mi-feature`
3. Realiza tus cambios y haz commit: `git commit -m "feat: descripción del cambio"`
4. Sube tu rama: `git push origin feature/mi-feature`
5. Abre un Pull Request.

---

<div align="center">

**Desarrollado para el ecosistema educativo de CIIP Latam** 🎓

</div>
]]>
