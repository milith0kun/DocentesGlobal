# Manual Digital Docente

Aplicacion web en Next.js para registrar la conformidad de docentes del ecosistema CIIP Latam, Geomina y Biomedic.

## Funciones principales

- Presenta el manual operativo docente.
- Guia al docente por un formulario de conformidad en 12 pasos.
- Consulta DNI mediante la API configurada para RENIEC.
- Genera un PDF de conformidad.
- Guarda datos en Google Sheets.
- Sube CV, foto y PDF a Google Drive.
- Prepara un mensaje de confirmacion por WhatsApp.

## Requisitos

- Node.js 20.19 o superior.
- Credenciales de Google Drive y Google Sheets.
- Token de consulta DNI compatible con `RENIEC_API_TOKEN`.

## Variables de entorno

Configura estas variables en `.env.local`:

```env
GOOGLE_SPREADSHEET_ID=
GOOGLE_SHEET_GID=
GOOGLE_DRIVE_ROOT_FOLDER_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
RENIEC_API_TOKEN=
```

Opcionalmente puedes usar `GOOGLE_APPLICATION_CREDENTIALS` con la ruta a un archivo JSON de cuenta de servicio.

`GOOGLE_SHEET_GID` permite apuntar a una pestana exacta de la hoja compartida. Si no se define, la app usa `GOOGLE_SHEET_NAME` o la pestana `Docentes`.

La cuenta de servicio debe tener habilitadas Google Sheets API y Google Drive API, y debe tener permisos de editor sobre la hoja y la carpeta raiz de Drive.

Para subir archivos a una carpeta normal de "Mi unidad", configura OAuth de una cuenta real:

```env
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/oauth2callback
GOOGLE_OAUTH_REFRESH_TOKEN=
```

Genera el enlace con `npm run google:oauth:url`, autoriza con la cuenta dueña de Drive, copia el parametro `code` de la URL final y ejecuta:

```bash
npm run google:oauth:token -- "CODIGO_DE_GOOGLE"
```

Copia el `refresh_token` resultante en `GOOGLE_OAUTH_REFRESH_TOKEN`.

Por privacidad, los archivos subidos a Drive no se publican para cualquier persona por defecto. Si necesitas enlaces publicos, define:

```env
GOOGLE_DRIVE_PUBLIC_UPLOADS=true
```

## Comandos

```bash
npm run dev
npm run build
npm run lint
node --test src/utils/emailValidation.test.js
```

## Notas de seguridad

La API valida campos obligatorios y tipos/tamanos basicos de archivos en servidor. Mantener esa validacion es importante porque las validaciones del navegador pueden saltarse.
