import { Readable } from 'stream';
import { getDriveClient } from './google-auth.js';

const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

function escapeDriveQueryValue(value = '') {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function assertDriveConfig() {
  if (!ROOT_FOLDER_ID) {
    throw new Error('Falta GOOGLE_DRIVE_ROOT_FOLDER_ID en variables de entorno');
  }
}

/**
 * Busca una carpeta por nombre dentro de un padre. Si no existe, la crea.
 */
export async function getOrCreateFolder(name, parentId) {
  assertDriveConfig();
  const drive = getDriveClient();
  const safeName = escapeDriveQueryValue(name);
  const safeParentId = escapeDriveQueryValue(parentId);

  const search = await drive.files.list({
    q: `name = '${safeName}' and mimeType = 'application/vnd.google-apps.folder' and '${safeParentId}' in parents and trashed = false`,
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  if (search.data.files && search.data.files.length > 0) {
    return search.data.files[0].id;
  }

  const folder = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
  });

  return folder.data.id;
}

/**
 * Crea la estructura completa de carpetas para un docente:
 * Docentes_{AÑO} / {Marca} / {Nombre_Documento}
 */
export async function createDocenteFolder(nombre, documento, marca) {
  assertDriveConfig();
  const year = new Date().getFullYear();

  const yearFolderId = await getOrCreateFolder(`Docentes_${year}`, ROOT_FOLDER_ID);

  const marcaNames = {
    ciip: 'CIIP_Latam',
    geomina: 'Geomina',
    biomedic: 'Biomedic',
    ambos: 'CIIP_Geomina',
  };
  const marcaFolderName = marcaNames[marca] || marca || 'General';
  const marcaFolderId = await getOrCreateFolder(marcaFolderName, yearFolderId);

  const safeName = (nombre || 'Docente')
    .replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  const safeDoc = (documento || 'SIN_DOC').trim();
  const docenteFolderName = `${safeName}_${safeDoc}`;
  const docenteFolderId = await getOrCreateFolder(docenteFolderName, marcaFolderId);

  return {
    folderId: docenteFolderId,
    folderUrl: `https://drive.google.com/drive/folders/${docenteFolderId}`,
  };
}

/**
 * Sube un archivo (Buffer) a Google Drive en una carpeta específica.
 * @returns {{ fileId: string, fileUrl: string }}
 */
export async function uploadFileToDrive(buffer, fileName, mimeType, folderId) {
  assertDriveConfig();
  const drive = getDriveClient();

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: 'id, webViewLink',
  });

  try {
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
  } catch {
    // Puede fallar en unidades compartidas o dominios restringidos.
    // Conservamos el flujo y retornamos igual el enlace del archivo.
  }

  return {
    fileId: response.data.id,
    fileUrl: response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view`,
  };
}
