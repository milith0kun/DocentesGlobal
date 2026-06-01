import nextEnv from '@next/env';
import { google } from 'googleapis';
import { getGoogleAuth, getGoogleDriveAuth } from '../src/lib/google-auth.js';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Falta ${key}`);
  }
  return value;
}

async function main() {
  const spreadsheetId = requireEnv('GOOGLE_SPREADSHEET_ID');
  const sheetGid = requireEnv('GOOGLE_SHEET_GID');
  const cvFolderId = process.env.GOOGLE_DRIVE_CV_FOLDER_ID;
  const fotoFolderId = process.env.GOOGLE_DRIVE_FOTO_FOLDER_ID;
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

  if ((!cvFolderId || !fotoFolderId) && !rootFolderId) {
    throw new Error('Configura GOOGLE_DRIVE_CV_FOLDER_ID/GOOGLE_DRIVE_FOTO_FOLDER_ID o GOOGLE_DRIVE_ROOT_FOLDER_ID');
  }

  const sheets = google.sheets({ version: 'v4', auth: getGoogleAuth() });
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'properties(title),spreadsheetUrl,sheets(properties(sheetId,title,gridProperties(rowCount,columnCount)))',
  });
  const sheet = spreadsheet.data.sheets?.find(
    (item) => String(item.properties?.sheetId) === String(sheetGid)
  );

  if (!sheet?.properties?.title) {
    throw new Error(`No se encontro la pestana con gid ${sheetGid}`);
  }

  const sheetName = sheet.properties.title;
  const quotedSheetName = `'${sheetName.replace(/'/g, "''")}'`;
  const headers = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${quotedSheetName}!A1:AZ1`,
  });

  const headerValues = headers.data.values?.[0] || [];
  const requiredHeaderText = ['marca temporal', 'direccion de correo electronico', 'nombre completo'];
  const normalizedHeaders = headerValues.map((value) =>
    String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  );
  const missingHeaders = requiredHeaderText.filter(
    (text) => !normalizedHeaders.some((header) => header.includes(text))
  );

  if (missingHeaders.length > 0) {
    throw new Error(`La hoja no parece ser la respuesta esperada. Faltan encabezados: ${missingHeaders.join(', ')}`);
  }

  const drive = google.drive({ version: 'v3', auth: getGoogleDriveAuth() });
  const about = await drive.about.get({ fields: 'user(emailAddress,displayName)' });
  const folders = [];

  for (const [label, folderId] of [
    ['cv', cvFolderId],
    ['foto', fotoFolderId],
    ['root', rootFolderId],
  ]) {
    if (!folderId) continue;
    const folder = await drive.files.get({
      fileId: folderId,
      fields: 'id,name,mimeType,webViewLink,owners(emailAddress,displayName)',
      supportsAllDrives: true,
    });

    if (folder.data.mimeType !== 'application/vnd.google-apps.folder') {
      throw new Error(`${label} no es una carpeta de Drive: ${folderId}`);
    }

    folders.push({
      label,
      name: folder.data.name,
      owner: folder.data.owners?.[0]?.emailAddress || '',
      link: folder.data.webViewLink,
    });
  }

  console.log(JSON.stringify({
    ok: true,
    spreadsheet: {
      title: spreadsheet.data.properties?.title,
      url: `${spreadsheet.data.spreadsheetUrl}#gid=${sheetGid}`,
      sheetName,
      headerCount: headerValues.length,
      rows: sheet.properties.gridProperties?.rowCount,
      columns: sheet.properties.gridProperties?.columnCount,
    },
    drive: {
      user: about.data.user,
      folders,
    },
  }, null, 2));
}

main().catch((error) => {
  console.error(`verify-integrations failed: ${error.message}`);
  process.exit(1);
});
