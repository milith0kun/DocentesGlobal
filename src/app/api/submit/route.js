import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createDocenteFolder, uploadFileToDrive } from '@/lib/google-drive.js';
import { appendDocenteRow } from '@/lib/google-sheets.js';
import { validateGoogleAuthConfig } from '@/lib/google-auth.js';

const marcaConfig = {
  ciip: { nombre: 'CIIP Latam' },
  geomina: { nombre: 'Geomina' },
  biomedic: { nombre: 'Biomedic' },
  ambos: { nombre: 'CIIP Latam & Geomina' },
};

const REQUIRED_STORAGE_ENV = [
  'GOOGLE_SPREADSHEET_ID',
  'GOOGLE_DRIVE_ROOT_FOLDER_ID',
];

const PLACEHOLDER_ENV_MARKERS = {
  GOOGLE_SPREADSHEET_ID: ['TU_SPREADSHEET_ID'],
  GOOGLE_DRIVE_ROOT_FOLDER_ID: ['TU_FOLDER_ID'],
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

const FILE_RULES = {
  cv: {
    label: 'CV',
    maxBytes: 5 * 1024 * 1024,
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
  return REQUIRED_STORAGE_ENV.filter((key) => !process.env[key]);
}

function placeholderStorageEnv() {
  return REQUIRED_STORAGE_ENV.filter((key) => {
    const value = String(process.env[key] || '');
    const markers = PLACEHOLDER_ENV_MARKERS[key] || [];
    return markers.some((marker) => value.includes(marker));
  });
}

function generateUniqueCode(marca) {
  const code = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
  return `MOD-${(marca || 'DOC').toUpperCase()}-${code}`;
}

function sanitizeNameForFile(value, fallback = 'archivo') {
  const normalized = String(value || fallback)
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  return normalized || fallback;
}

function fileExtension(fileName, fallback) {
  const ext = String(fileName || '')
    .split('.')
    .pop()
    ?.toLowerCase()
    ?.trim();
  return ext || fallback;
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

  if (!Object.prototype.hasOwnProperty.call(marcaConfig, fields.marca)) {
    missing.push('marca valida');
  }

  return [...new Set([...missing, ...missingAcceptances])];
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

export async function POST(request) {
  try {
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

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        fields[key] = value;
      }
    }

    const cvFile = formData.get('cv');
    const fotoFile = formData.get('foto');

    const invalidFields = validateRequiredFields(fields);
    const invalidCv = validateUpload(cvFile, 'cv');
    const invalidFoto = validateUpload(fotoFile, 'foto');
    const uploadErrors = [invalidCv, invalidFoto].filter(Boolean);

    if (invalidFields.length > 0 || uploadErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Datos incompletos o invalidos: ${[...invalidFields, ...uploadErrors].join(', ')}`,
        },
        { status: 400 }
      );
    }

    const marca = fields.marca;
    const institucion = marcaConfig[marca]?.nombre || marca;
    const code = generateUniqueCode(marca);
    const fecha = new Date().toLocaleDateString('es-PE', { timeZone: 'America/Lima' });
    const baseName = sanitizeNameForFile(fields.nombre, 'Docente');

    const links = {
      cvUrl: '',
      fotoUrl: '',
      pdfUrl: '',
      folderUrl: '',
    };

    const { folderId, folderUrl } = await createDocenteFolder(
      fields.nombre,
      fields.documento,
      marca
    );
    links.folderUrl = folderUrl;

    if (cvFile && cvFile.size > 0) {
      const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
      const cvExt = fileExtension(cvFile.name, 'pdf');
      const cvName = `CV_${baseName}.${cvExt}`;
      const cvMime = cvFile.type || 'application/octet-stream';
      const cvResult = await uploadFileToDrive(cvBuffer, cvName, cvMime, folderId);
      links.cvUrl = cvResult.fileUrl;
    }

    if (fotoFile && fotoFile.size > 0) {
      const fotoBuffer = Buffer.from(await fotoFile.arrayBuffer());
      const fotoExt = fileExtension(fotoFile.name, 'jpg');
      const fotoName = `Foto_${baseName}.${fotoExt}`;
      const fotoMime = fotoFile.type || 'application/octet-stream';
      const fotoResult = await uploadFileToDrive(fotoBuffer, fotoName, fotoMime, folderId);
      links.fotoUrl = fotoResult.fileUrl;
    }

    const pdfData = { ...fields, code, fecha, institucion };
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
    });
  } catch (error) {
    console.error('Error en /api/submit:', error);
    const raw = String(error?.message || '');
    let friendly = raw || 'Error al procesar el envio';

    if (/GOOGLE_APPLICATION_CREDENTIALS/i.test(raw)) {
      friendly = 'Error en GOOGLE_APPLICATION_CREDENTIALS. Verifica que la ruta del JSON exista.';
    } else if (/DECODER routines|private key|PEM|unsupported|Google Auth/i.test(raw)) {
      friendly = 'Error en GOOGLE_PRIVATE_KEY. Verifica formato PEM y saltos de linea (\\n).';
    }

    return NextResponse.json(
      {
        success: false,
        error: friendly,
      },
      { status: 500 }
    );
  }
}
