import { existsSync, readFileSync } from 'fs';
import { google } from 'googleapis';

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];
const GOOGLE_DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];

const REQUIRED_INLINE_ENV = ['GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY'];
const PLACEHOLDER_PATTERNS = {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: ['tu-service-account@tu-proyecto.iam.gserviceaccount.com'],
  GOOGLE_PRIVATE_KEY: ['TU_CLAVE_PRIVADA_AQUI'],
};

let authClient = null;
let driveAuthClient = null;

function normalizePrivateKey(value) {
  return String(value || '')
    .replace(/\\\r?\n/g, '\n')
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

function getOAuthRedirectUri() {
  return process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3000/oauth2callback';
}

function readOAuthClientFromFile() {
  const file = String(process.env.GOOGLE_OAUTH_CLIENT_SECRET_FILE || '').trim();
  if (!file) return null;

  if (!existsSync(file)) {
    throw new Error(`No existe GOOGLE_OAUTH_CLIENT_SECRET_FILE en ruta: ${file}`);
  }

  const parsed = JSON.parse(readFileSync(file, 'utf8'));
  const config = parsed.web || parsed.installed;

  if (!config?.client_id || !config?.client_secret) {
    throw new Error('GOOGLE_OAUTH_CLIENT_SECRET_FILE no contiene client_id/client_secret validos');
  }

  return {
    clientId: config.client_id,
    clientSecret: config.client_secret,
  };
}

function getOAuthClientConfig() {
  const fileConfig = readOAuthClientFromFile();

  return {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || fileConfig?.clientId,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || fileConfig?.clientSecret,
  };
}

export function hasGoogleDriveOAuthConfig() {
  const config = getOAuthClientConfig();
  return Boolean(
    config.clientId &&
    config.clientSecret &&
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  );
}

export function createGoogleOAuthClient() {
  const config = getOAuthClientConfig();

  if (!config.clientId || !config.clientSecret) {
    throw new Error(
      'Faltan GOOGLE_OAUTH_CLIENT_ID/GOOGLE_OAUTH_CLIENT_SECRET o GOOGLE_OAUTH_CLIENT_SECRET_FILE'
    );
  }

  return new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    getOAuthRedirectUri()
  );
}

export function getGoogleDriveAuth() {
  if (driveAuthClient) return driveAuthClient;

  if (!hasGoogleDriveOAuthConfig()) {
    driveAuthClient = getGoogleAuth();
    return driveAuthClient;
  }

  const oauthClient = createGoogleOAuthClient();
  oauthClient.setCredentials({
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
  });
  driveAuthClient = oauthClient;
  return driveAuthClient;
}

export function getGoogleOAuthConsentUrl() {
  const oauthClient = createGoogleOAuthClient();
  return oauthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: GOOGLE_DRIVE_SCOPES,
  });
}

export async function exchangeGoogleOAuthCode(code) {
  const oauthClient = createGoogleOAuthClient();
  const { tokens } = await oauthClient.getToken(code);
  return tokens;
}

export function getSheetsClient() {
  return google.sheets({ version: 'v4', auth: getGoogleAuth() });
}

export function getDriveClient() {
  return google.drive({ version: 'v3', auth: getGoogleDriveAuth() });
}
