import { existsSync } from 'fs';
import { google } from 'googleapis';

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

const REQUIRED_INLINE_ENV = ['GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY'];
const PLACEHOLDER_PATTERNS = {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: ['tu-service-account@tu-proyecto.iam.gserviceaccount.com'],
  GOOGLE_PRIVATE_KEY: ['TU_CLAVE_PRIVADA_AQUI'],
};

let authClient = null;

function normalizePrivateKey(value) {
  return String(value || '')
    .replace(/\\n/g, '\n')
    .replace(/^"(.*)"$/s, '$1');
}

function getMissingInlineEnv() {
  return REQUIRED_INLINE_ENV.filter((key) => !process.env[key]);
}

function getPlaceholderInlineEnv() {
  return REQUIRED_INLINE_ENV.filter((key) => {
    const value = String(process.env[key] || '');
    const patterns = PLACEHOLDER_PATTERNS[key] || [];
    return patterns.some((pattern) => value.includes(pattern));
  });
}

export function validateGoogleAuthConfig() {
  const keyFile = String(process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim();

  if (keyFile) {
    if (!existsSync(keyFile)) {
      return {
        ok: false,
        error: `No existe GOOGLE_APPLICATION_CREDENTIALS en ruta: ${keyFile}`,
      };
    }
    return {
      ok: true,
      mode: 'key_file',
      keyFile,
    };
  }

  const missing = getMissingInlineEnv();
  if (missing.length > 0) {
    return {
      ok: false,
      error: `Faltan variables de entorno de Google Auth: ${missing.join(', ')}`,
    };
  }

  const placeholder = getPlaceholderInlineEnv();
  if (placeholder.length > 0) {
    return {
      ok: false,
      error: `Variables con valores de ejemplo en Google Auth: ${placeholder.join(', ')}`,
    };
  }

  const normalizedPrivateKey = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  if (!normalizedPrivateKey.includes('BEGIN PRIVATE KEY')) {
    return {
      ok: false,
      error: 'GOOGLE_PRIVATE_KEY no tiene formato PEM valido',
    };
  }

  return {
    ok: true,
    mode: 'inline',
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: normalizedPrivateKey,
  };
}

export function getGoogleAuth() {
  if (authClient) return authClient;

  const config = validateGoogleAuthConfig();
  if (!config.ok) {
    throw new Error(config.error);
  }

  if (config.mode === 'key_file') {
    authClient = new google.auth.GoogleAuth({
      keyFile: config.keyFile,
      scopes: GOOGLE_SCOPES,
    });
    return authClient;
  }

  authClient = new google.auth.GoogleAuth({
    credentials: {
      client_email: config.clientEmail,
      private_key: config.privateKey,
    },
    scopes: GOOGLE_SCOPES,
  });
  return authClient;
}

export function getSheetsClient() {
  return google.sheets({ version: 'v4', auth: getGoogleAuth() });
}

export function getDriveClient() {
  return google.drive({ version: 'v3', auth: getGoogleAuth() });
}
