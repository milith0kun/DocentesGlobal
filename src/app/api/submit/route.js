import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createDocenteFolder, getFormResponseFolders, uploadFileToDrive } from '@/lib/google-drive.js';
import { appendDocenteRow } from '@/lib/google-sheets.js';
import { validateGoogleAuthConfig } from '@/lib/google-auth.js';
import { rateLimit } from '@/lib/request-security.js';

const marcaConfig = {
  ciip: { nombre: 'CIIP Latam' },
  geomina: { nombre: 'Geomina' },
  biomedic: { nombre: 'Biomedic' },
  ambos: { nombre: 'CIIP Latam & Geomina' },
};

const marcaAliases = {
  ciip: 'CIIP Latam',
  geomina: 'Geomina',
  biomedic: 'Biomedic',
};

const REQUIRED_STORAGE_ENV = [
  'GOOGLE_SPREADSHEET_ID',
];

const PLACEHOLDER_ENV_MARKERS = {
  GOOGLE_SPREADSHEET_ID: ['TU_SPREADSHEET_ID'],
  GOOGLE_DRIVE_ROOT_FOLDER_ID: ['TU_FOLDER_ID'],
  GOOGLE_DRIVE_CV_FOLDER_ID: ['TU_FOLDER_ID'],
  GOOGLE_DRIVE_FOTO_FOLDER_ID: ['TU_FOLDER_ID'],
};

const REQUIRED_FORM_FIELDS = [
  'nombre',
  'correo',
  'marca',
  'documento',
  'fechaNacimiento',
  'telefono',
  'metodoPago',
  'numeroCuenta',
  'direccion',
  'softwares',
  'cursoSonado',
  'mejoraAdmin',
];

const REQUIRED_ACCEPTANCES = [
  'aceptaMetodologia',
  'aceptaSabado',
  'aceptaDomingo',
  'aceptaLunes',
  'aceptaProtocolo',
  'aceptaAsistencia',
  'aceptaTop',
];

const FIELD_LIMITS = {
  nombre: 140,
  correo: 180,
  marca: 40,
  documento: 8,
  fechaNacimiento: 10,
  telefono: 32,
  metodoPago: 80,
  metodoPagoOtro: 80,
  numeroCuenta: 140,
  direccion: 220,
  softwares: 1200,
  cursoSonado: 1200,
  mejoraAdmin: 1200,
  comentarios: 1500,
};

const FILE_RULES = {
  cv: {
    label: 'CV',
    maxBytes: 10 * 1024 * 1024,
    extensions: ['pdf', 'doc', 'docx'],
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  foto: {
    label: 'foto',
    maxBytes: 4 * 1024 * 1024,
    extensions: ['jpg', 'jpeg', 'png', 'webp'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

function missingStorageEnv() {
  const missing = REQUIRED_STORAGE_ENV.filter((key) => !process.env[key]);
  const hasFormFolders = Boolean(
    process.env.GOOGLE_DRIVE_CV_FOLDER_ID &&
    process.env.GOOGLE_DRIVE_FOTO_FOLDER_ID
  );
  const hasRootFolder = Boolean(process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID);

  if (!hasFormFolders && !hasRootFolder) {
    missing.push('GOOGLE_DRIVE_CV_FOLDER_ID/GOOGLE_DRIVE_FOTO_FOLDER_ID o GOOGLE_DRIVE_ROOT_FOLDER_ID');
  }

  return missing;
}

function placeholderStorageEnv() {
  return [
    ...REQUIRED_STORAGE_ENV,
    'GOOGLE_DRIVE_ROOT_FOLDER_ID',
    'GOOGLE_DRIVE_CV_FOLDER_ID',
    'GOOGLE_DRIVE_FOTO_FOLDER_ID',
  ].filter((key) => {
    const value = String(process.env[key] || '');
    const markers = PLACEHOLDER_ENV_MARKERS[key] || [];
    return markers.some((marker) => value.includes(marker));
  });
}

function generateUniqueCode(marca) {
  const code = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
  const marcaCode = String(marca || 'DOC')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase();
  return `MOD-${marcaCode || 'DOC'}-${code}`;
}

function sanitizeNameForFile(value, fallback = 'archivo') {
  const normalized = String(value || fallback)
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  return normalized || fallback;
}

function googleFormStyleFileName(originalName, docenteName, fallbackExt) {
  const ext = fileExtension(originalName, fallbackExt);
  const base = String(originalName || 'archivo')
    .replace(/\.[^.]+$/, '')
    .trim() || 'archivo';
  const safeBase = sanitizeNameForFile(base, 'archivo');
  const safeDocente = sanitizeNameForFile(docenteName, 'Docente').replace(/_/g, ' ');

  return `${safeBase} - ${safeDocente}.${ext}`;
}

function fileExtension(fileName, fallback) {
  const ext = String(fileName || '')
    .split('.')
    .pop()
    ?.toLowerCase()
    ?.trim();
  return ext || fallback;
}

function normalizeFieldValue(key, value) {
  const limit = FIELD_LIMITS[key] || 1000;
  return String(value || '')
    .split(String.fromCharCode(0))
    .join('')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim()
    .slice(0, limit);
}

function hasInvalidFieldLength(fields) {
  return Object.entries(FIELD_LIMITS).filter(([key, limit]) => String(fields[key] || '').length > limit);
}

function validateRequiredFields(fields) {
  const missing = REQUIRED_FORM_FIELDS.filter((key) => !String(fields[key] || '').trim());
  const missingAcceptances = REQUIRED_ACCEPTANCES.filter((key) => fields[key] !== 'true');

  if (fields.metodoPago === 'otro' && !String(fields.metodoPagoOtro || '').trim()) {
    missing.push('metodoPagoOtro');
  }

  if (!/^\d{8}$/.test(String(fields.documento || ''))) {
    missing.push('documento valido');
  }

  if (!/^\S+@\S+\.\S{2,}$/.test(String(fields.correo || ''))) {
    missing.push('correo valido');
  }

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(String(fields.fechaNacimiento || ''))) {
    missing.push('fechaNacimiento valida');
  }

  if (!isValidMarca(fields.marca)) {
    missing.push('marca valida');
  }

  return [...new Set([...missing, ...missingAcceptances])];
}

function selectedMarcas(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function isValidMarca(value) {
  if (Object.prototype.hasOwnProperty.call(marcaConfig, value)) return true;

  const marcas = selectedMarcas(value);
  const unique = new Set(marcas);
  return (
    marcas.length > 0 &&
    marcas.length <= 2 &&
    unique.size === marcas.length &&
    marcas.every((marca) => Object.prototype.hasOwnProperty.call(marcaAliases, marca))
  );
}

function institutionName(value) {
  if (marcaConfig[value]) return marcaConfig[value].nombre;

  const names = selectedMarcas(value).map((marca) => marcaAliases[marca]).filter(Boolean);
  return names.length > 0 ? names.join(' & ') : value;
}

function friendlyGoogleError(error) {
  const raw = String(error?.message || '');

  if (/Service Accounts do not have storage quota|storageQuotaExceeded/i.test(raw)) {
    return 'Drive no pudo subir archivos porque la cuenta de servicio no tiene cuota de almacenamiento en una carpeta normal. Usa una Unidad compartida o autenticacion OAuth.';
  }

  if (/Drive API has not been used|drive.googleapis.com/i.test(raw)) {
    return 'Google Drive API no esta habilitada en el proyecto de la cuenta de servicio.';
  }

  if (/Sheets API has not been used|sheets.googleapis.com|SERVICE_DISABLED/i.test(raw)) {
    return 'Google Sheets API no esta habilitada en el proyecto de la cuenta de servicio.';
  }

  if (/GOOGLE_APPLICATION_CREDENTIALS/i.test(raw)) {
    return 'Error en GOOGLE_APPLICATION_CREDENTIALS. Verifica que la ruta del JSON exista.';
  }

  if (/DECODER routines|private key|PEM|unsupported|Google Auth/i.test(raw)) {
    return 'Error en GOOGLE_PRIVATE_KEY. Verifica formato PEM y saltos de linea (\\n).';
  }

  return raw && process.env.NODE_ENV !== 'production'
    ? raw
    : 'Error al procesar el envio. Revisa la configuracion del servidor.';
}

function validateUpload(file, key) {
  const rule = FILE_RULES[key];

  if (!file || typeof file === 'string' || file.size <= 0) {
    return `Falta subir ${rule.label}`;
  }

  if (file.size > rule.maxBytes) {
    return `${rule.label} supera el tamano maximo permitido`;
  }

  const ext = fileExtension(file.name, '');
  if (!rule.extensions.includes(ext)) {
    return `${rule.label} tiene una extension no permitida`;
  }

  if (file.type && !rule.mimeTypes.includes(file.type)) {
    return `${rule.label} tiene un tipo de archivo no permitido`;
  }

  return null;
}

async function validateFileSignature(file, key) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ext = fileExtension(file.name, '');

  if (key === 'foto') {
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    const isWebp =
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;

    if (!isJpeg && !isPng && !isWebp) {
      return 'foto no parece ser una imagen valida';
    }
  }

  if (key === 'cv') {
    const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
    const isZipBasedDocx = ext === 'docx' && bytes[0] === 0x50 && bytes[1] === 0x4b;
    const isLegacyDoc = ext === 'doc' && bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0;

    if (!isPdf && !isZipBasedDocx && !isLegacyDoc) {
      return 'CV no parece ser un PDF, DOC o DOCX valido';
    }
  }

  return null;
}

export async function POST(request) {
  try {
    const limit = rateLimit(request, { keyPrefix: 'submit', limit: 8, windowMs: 10 * 60_000 });
    if (!limit.ok) {
      return NextResponse.json(
        { success: false, error: 'Demasiados envios desde esta conexion. Intenta nuevamente mas tarde.' },
        {
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfter) },
        }
      );
    }

    const missing = missingStorageEnv();
    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Falta configurar variables para Drive/Sheets: ${missing.join(', ')}`,
        },
        { status: 500 }
      );
    }

    const placeholder = placeholderStorageEnv();
    if (placeholder.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Debes reemplazar valores de ejemplo en .env.local: ${placeholder.join(', ')}`,
        },
        { status: 500 }
      );
    }

    const authStatus = validateGoogleAuthConfig();
    if (!authStatus.ok) {
      return NextResponse.json(
        {
          success: false,
          error: authStatus.error,
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const fields = {};
    const tooLongFields = [];

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        const limit = FIELD_LIMITS[key];
        if (limit && value.length > limit) {
          tooLongFields.push(`${key} demasiado largo`);
        }
        fields[key] = normalizeFieldValue(key, value);
      }
    }

    const cvFile = formData.get('cv');
    const fotoFile = formData.get('foto');

    const invalidFields = validateRequiredFields(fields);
    const invalidLengths = [
      ...tooLongFields,
      ...hasInvalidFieldLength(fields).map(([key]) => `${key} demasiado largo`),
    ];
    const invalidCv = validateUpload(cvFile, 'cv');
    const invalidFoto = validateUpload(fotoFile, 'foto');
    const signatureCv = invalidCv ? null : await validateFileSignature(cvFile, 'cv');
    const signatureFoto = invalidFoto ? null : await validateFileSignature(fotoFile, 'foto');
    const uploadErrors = [invalidCv, invalidFoto, signatureCv, signatureFoto].filter(Boolean);

    if (invalidFields.length > 0 || invalidLengths.length > 0 || uploadErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Datos incompletos o invalidos: ${[...invalidFields, ...invalidLengths, ...uploadErrors].join(', ')}`,
        },
        { status: 400 }
      );
    }

    const marca = fields.marca;
    const institucion = institutionName(marca);
    const code = generateUniqueCode(marca);
    const fecha = new Date().toLocaleDateString('es-PE', { timeZone: 'America/Lima' });
    const baseName = sanitizeNameForFile(fields.nombre, 'Docente');

    const links = {
      cvUrl: '',
      fotoUrl: '',
      pdfUrl: '',
      folderUrl: '',
    };
    const warnings = [];

    try {
      const formFolders = getFormResponseFolders();
      let folderId = null;

      if (formFolders) {
        links.folderUrl = '';
      } else {
        const { folderId: docenteFolderId, folderUrl } = await createDocenteFolder(
          fields.nombre,
          fields.documento,
          marca
        );
        folderId = docenteFolderId;
        links.folderUrl = folderUrl;
      }

      if (cvFile && cvFile.size > 0) {
        const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
        const cvExt = fileExtension(cvFile.name, 'pdf');
        const cvName = formFolders
          ? googleFormStyleFileName(cvFile.name, fields.nombre, cvExt)
          : `CV_${baseName}.${cvExt}`;
        const cvMime = cvFile.type || 'application/octet-stream';
        const cvResult = await uploadFileToDrive(
          cvBuffer,
          cvName,
          cvMime,
          formFolders?.cvFolderId || folderId
        );
        links.cvUrl = cvResult.fileUrl;
      }

      if (fotoFile && fotoFile.size > 0) {
        const fotoBuffer = Buffer.from(await fotoFile.arrayBuffer());
        const fotoExt = fileExtension(fotoFile.name, 'jpg');
        const fotoName = formFolders
          ? googleFormStyleFileName(fotoFile.name, fields.nombre, fotoExt)
          : `Foto_${baseName}.${fotoExt}`;
        const fotoMime = fotoFile.type || 'application/octet-stream';
        const fotoResult = await uploadFileToDrive(
          fotoBuffer,
          fotoName,
          fotoMime,
          formFolders?.fotoFolderId || folderId
        );
        links.fotoUrl = fotoResult.fileUrl;
      }
    } catch (driveError) {
      console.error('Error subiendo archivos a Drive:', driveError);
      const warning = friendlyGoogleError(driveError);
      warnings.push(warning);
      links.cvUrl = `PENDIENTE: ${warning}`;
      links.fotoUrl = `PENDIENTE: ${warning}`;
      links.folderUrl = links.folderUrl || `PENDIENTE: ${warning}`;
    }

    await appendDocenteRow(
      {
        code,
        nombre: fields.nombre,
        correo: fields.correo,
        documento: fields.documento,
        fechaNacimiento: fields.fechaNacimiento,
        institucion,
        marca,
        telefono: fields.telefono,
        metodoPago: fields.metodoPago,
        metodoPagoOtro: fields.metodoPagoOtro,
        numeroCuenta: fields.numeroCuenta,
        direccion: fields.direccion,
        softwares: fields.softwares,
        cursoSonado: fields.cursoSonado,
        mejoraAdmin: fields.mejoraAdmin,
        comentarios: fields.comentarios,
        aceptaMetodologia: fields.aceptaMetodologia,
        aceptaSabado: fields.aceptaSabado,
        aceptaDomingo: fields.aceptaDomingo,
        aceptaLunes: fields.aceptaLunes,
        aceptaProtocolo: fields.aceptaProtocolo,
        aceptaAsistencia: fields.aceptaAsistencia,
        aceptaTop: fields.aceptaTop,
      },
      links
    );

    return NextResponse.json({
      success: true,
      code,
      fecha,
      institucion,
      driveFolder: links.folderUrl,
      pdfUrl: links.pdfUrl,
      cvUrl: links.cvUrl,
      fotoUrl: links.fotoUrl,
      warning: warnings.join(' '),
    });
  } catch (error) {
    console.error('Error en /api/submit:', error);
    const friendly = friendlyGoogleError(error);

    return NextResponse.json(
      {
        success: false,
        error: friendly,
      },
      { status: 500 }
    );
  }
}
