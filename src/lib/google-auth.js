import { google } from 'googleapis';

let authClient = null;
const REQUIRED_ENV = ['GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY'];

function getMissingEnv() {
  return REQUIRED_ENV.filter((key) => !process.env[key]);
}

export function getGoogleAuth() {
  const missing = getMissingEnv();
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno de Google Auth: ${missing.join(', ')}`);
  }

  if (!authClient) {
    authClient = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });
  }
  return authClient;
}

export function getSheetsClient() {
  return google.sheets({ version: 'v4', auth: getGoogleAuth() });
}

export function getDriveClient() {
  return google.drive({ version: 'v3', auth: getGoogleAuth() });
}
