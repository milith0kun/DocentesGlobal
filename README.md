# Manual Digital Docente

Plataforma web para el registro de conformidad docente del ecosistema educativo CIIP Latam, Geomina y Biomedic.

Produccion: https://manualdocentes.ecosdelseo.com/

---

## Tabla de Contenidos

- Descripcion
- Reemplazo y Unificacion de Procesos
- Caracteristicas Principales
- Arquitectura del Proyecto
- Flujo del Onboarding
- Tecnologias
- Requisitos Previos
- Instalacion
- Variables de Entorno
- Comandos Disponibles
- API Endpoints
- Despliegue
- Seguridad
- Contribucion

---

## Descripcion

Manual Digital Docente es una aplicacion web construida con Next.js 15 y React 19 que digitaliza el proceso de induccion y registro de conformidad para docentes del ecosistema educativo conformado por tres marcas:

- CIIP Latam (Capacitacion profesional en ingenieria)
- Geomina (Formacion en mineria y geociencias)
- Biomedic (Educacion en salud y biomedicina)

La plataforma guia al docente a traves de un wizard interactivo de multiples pasos donde revisa el manual operativo, registra sus datos personales, firma digitalmente su conformidad y envia la confirmacion via WhatsApp a su coordinador academico.

---

## Reemplazo y Unificacion de Procesos

Este proyecto reemplaza y abstrae de mejor manera el flujo del antiguo formulario de Google Forms (https://docs.google.com/forms/d/1cfjZ1Ph1Ne2q9tzquh71w4FITqOY3kHTSQh3EnBPKSM/edit?edit_requested=true#responses).

A partir de la puesta en marcha de este desarrollo, se deja de usar dicho formulario para unificar toda la induccion en un flujo unico y automatizado. Esto permite conectar el flujo facilmente con otros procesos clave:
- Conexion con Google Sheets para el consolidado automatico.
- Conexion con Google Drive para la creacion automatica de carpetas y gestion de documentos (CV, fotos, PDFs firmados) sin intervencion manual.
- Conexion directa con WhatsApp para notificaciones e inicio inmediato de coordinaciones.

---

## Caracteristicas Principales

- Wizard de Onboarding: Formulario guiado de multiples pasos con validacion en tiempo real.
- Consulta de DNI: Integracion con API RENIEC para autocompletar datos del docente.
- Generacion de PDF: Documento de conformidad generado en el navegador con @react-pdf/renderer.
- Google Sheets: Almacenamiento automatico de datos en hojas de calculo compartidas.
- Google Drive: Subida de CV, foto de perfil y PDF de conformidad a carpetas organizadas.
- WhatsApp: Generacion de mensaje de confirmacion prellenado para el coordinador.
- Programa Docente TOP: Visualizacion de metricas y ranking de desempeno docente.
- Diseno Responsivo: Diseno adaptado para moviles, tablets y escritorio.
- Multi-marca: Interfaz dinamica que se adapta a los colores y logos de cada institucion.

---

## Arquitectura del Proyecto

```
Docentes/
├── public/
│   ├── assets/              # Logos e imagenes de marcas
│   ├── videos/              # Video de mascota animada
│   ├── favicon.svg
│   ├── icons.svg            # Sprite de iconos SVG
│   └── robots.txt
│
├── scripts/
│   ├── patch-next-webpack-loaders.cjs   # Patch de compatibilidad con Next.js
│   ├── verify-integrations.mjs          # Verificacion de APIs de Google
│   ├── google-oauth-url.mjs             # Generacion de URL de autorizacion OAuth
│   └── google-oauth-token.mjs           # Intercambio de codigo por refresh token
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── reniec/route.js          # API de consulta DNI
│   │   │   └── submit/route.js          # API de envio del formulario
│   │   ├── layout.jsx                   # Layout raiz con metadata SEO
│   │   ├── page.jsx                     # Pagina principal
│   │   └── globals.css                  # Estilos globales
│   │
│   ├── components/
│   │   ├── OnboardingWizard.jsx         # Wizard principal (12 pasos)
│   │   ├── Hero.jsx                     # Seccion hero de la landing
│   │   ├── Horarios.jsx                 # Horarios de entrega
│   │   ├── Filosofia.jsx                # Filosofia institucional
│   │   ├── Protocolos.jsx               # Protocolos operativos
│   │   ├── DocenteTop.jsx               # Dashboard Docente TOP
│   │   ├── Conformidad.jsx              # Seccion de conformidad
│   │   ├── Logos.jsx                    # Componente de logos
│   │   ├── Navbar.jsx                   # Barra de navegacion
│   │   └── Footer.jsx                   # Pie de pagina
│   │
│   ├── lib/
│   │   ├── google-auth.js               # Autenticacion con Google APIs
│   │   ├── google-drive.js              # Operaciones con Google Drive
│   │   ├── google-sheets.js             # Operaciones con Google Sheets
│   │   └── request-security.js          # Validaciones de seguridad
│   │
│   └── utils/
│       ├── emailValidation.js           # Validacion de emails
│       └── emailValidation.test.js      # Tests de validacion
│
├── .env.example                         # Plantilla de variables de entorno
├── next.config.mjs                      # Configuracion de Next.js
├── nixpacks.toml                        # Configuracion de despliegue
├── package.json
└── eslint.config.js
```

---

## Flujo del Onboarding

El wizard guia al docente a traves de los siguientes pasos:

1. Seleccion de Institucion
2. Consulta de DNI y Datos Personales
3. Metodologia Doing by Learning
4. Fechas de Corte Innegociables
5. Acceso a Drive Institucional
6. Protocolo de Imagen y Comunicacion
7. Politica de Asistencia
8. Programa Docente TOP
9. Contacto y Datos de Pago
10. Subir Documentacion (CV y Foto)
11. Perfil Profesional y Comentarios
12. Declaracion de Conformidad, Firma y WhatsApp

---

## Tecnologias

- Framework: Next.js 15 (App Router)
- UI: React 19
- PDF: @react-pdf/renderer
- Validacion: Zod v4
- APIs Google: googleapis (Sheets + Drive)
- Linting: ESLint 9
- Tipografias: Outfit, Manrope, Plus Jakarta Sans, Sora (Google Fonts)
- Deploy: Vercel / Nixpacks

---

## Requisitos Previos

- Node.js >= 20.19.0
- npm >= 10
- Cuenta de servicio de Google con acceso a Google Sheets API y Google Drive API
- Token de API RENIEC (para consulta de DNI)

---

## Instalacion

```bash
# 1. Clonar el repositorio
git clone https://github.com/milith0kun/DocentesGlobal.git
cd DocentesGlobal

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Iniciar en modo desarrollo
npm run dev
```

La aplicacion estara disponible en http://localhost:3000.

---

## Variables de Entorno

Crea un archivo `.env.local` en la raiz del proyecto con las siguientes variables:

### Google Sheets y Drive (Cuenta de Servicio)

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-cuenta@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_SPREADSHEET_ID=id_de_tu_hoja_de_calculo
GOOGLE_SHEET_GID=id_pestana
GOOGLE_DRIVE_ROOT_FOLDER_ID=id_carpeta_raiz
GOOGLE_DRIVE_CV_FOLDER_ID=id_carpeta_cv
GOOGLE_DRIVE_FOTO_FOLDER_ID=id_carpeta_foto
```

La cuenta de servicio debe tener permisos de editor sobre la hoja de calculo y la carpeta raiz de Drive. Si no se define GOOGLE_SHEET_GID, se usa la pestana Docentes por defecto.

### Google Drive (OAuth — para carpetas de "Mi unidad")

Si necesitas subir archivos a una carpeta personal de Google Drive:

```env
GOOGLE_OAUTH_CLIENT_ID=tu_client_id
GOOGLE_OAUTH_CLIENT_SECRET=tu_client_secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/oauth2callback
GOOGLE_OAUTH_REFRESH_TOKEN=tu_refresh_token
```

Para obtener el refresh token:

```bash
# 1. Generar URL de autorizacion
npm run google:oauth:url

# 2. Autorizar en el navegador con la cuenta duena de Drive

# 3. Copiar el parametro "code" de la URL y ejecutar:
npm run google:oauth:token -- "CODIGO_DE_GOOGLE"

# 4. Copiar el refresh_token resultante a .env.local
```

### API RENIEC

```env
RENIEC_API_TOKEN=tu_token_de_consulta_dni
```

### Opcionales

```env
GOOGLE_DRIVE_PUBLIC_UPLOADS=true   # Hacer publicos los archivos subidos a Drive
```

---

## Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en localhost:3000
- `npm run build`: Genera el build de produccion
- `npm run start`: Inicia el servidor de produccion
- `npm run lint`: Ejecuta ESLint sobre todo el proyecto
- `npm run verify:integrations`: Verifica la conexion con Google Sheets y Drive
- `npm run google:oauth:url`: Genera la URL de autorizacion OAuth
- `npm run google:oauth:token -- "CODE"`: Intercambia un codigo OAuth por un refresh token
- `node --test src/utils/emailValidation.test.js`: Ejecuta los tests de validacion de email

---

## API Endpoints

### POST /api/reniec

Consulta datos de un ciudadano peruano por su numero de DNI.

Parametro `dni` (string): Numero de DNI (8 digitos).

Respuesta exitosa:
```json
{
  "nombre": "JUAN CARLOS PEREZ GARCIA",
  "dni": "12345678"
}
```

### POST /api/submit

Envia el formulario completo de conformidad docente. Acepta `multipart/form-data`.

Campos:
- `marca` (string): Institucion (ciip, geomina, biomedic)
- `dni` (string): DNI del docente
- `nombre` (string): Nombre completo
- `email` (string): Correo electronico
- `telefono` (string): Numero de telefono
- `profesion` (string): Profesion del docente
- `cv` (File): Archivo PDF del CV
- `foto` (File): Fotografia de perfil
- `firma` (string): Firma digital (base64)

Respuesta exitosa:
```json
{
  "code": "CIIP-20260601-ABC12",
  "message": "Conformidad registrada exitosamente"
}
```

---

## Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub con Vercel.
2. Configura las variables de entorno en el panel de Vercel.
3. Cada push a main desplegara automaticamente.

### Nixpacks / Railway

El proyecto incluye un archivo nixpacks.toml preconfigurado.

---

## Seguridad

- Validacion en servidor: La API /api/submit valida todos los campos obligatorios, tipos y tamanos de archivos en el servidor.
- Sanitizacion de entrada: Los datos se sanitizan antes de ser almacenados en Google Sheets.
- Variables sensibles: Todas las credenciales se manejan exclusivamente a traves de variables de entorno y nunca se incluyen en el repositorio.
- Archivos privados: Por defecto, los archivos subidos a Google Drive no se publican con acceso publico.

---

## Contribucion

1. Haz un fork del repositorio.
2. Crea una rama para tu feature: `git checkout -b feature/mi-feature`
3. Realiza tus cambios y haz commit: `git commit -m "feat: descripcion del cambio"`
4. Sube tu rama: `git push origin feature/mi-feature`
5. Abre un Pull Request.

---

Desarrollado para el ecosistema educativo de CIIP Latam.
