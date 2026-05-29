import { NextResponse } from 'next/server';
import { createDocenteFolder, uploadFileToDrive } from '@/lib/google-drive.js';
import { appendDocenteRow, ensureSheetHeaders } from '@/lib/google-sheets.js';
import { generateConformidadPDF } from '@/lib/pdf-generator.jsx';

const marcaConfig = {
  ciip: { nombre: 'CIIP Latam' },
  geomina: { nombre: 'Geomina' },
  biomedic: { nombre: 'Biomedic' },
  ambos: { nombre: 'CIIP Latam & Geomina' },
};

const REQUIRED_GOOGLE_ENV = [
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_SPREADSHEET_ID',
  'GOOGLE_DRIVE_ROOT_FOLDER_ID',
];

function missingGoogleEnv() {
  return REQUIRED_GOOGLE_ENV.filter((key) => !process.env[key]);
}

function generateUniqueCode(marca) {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MOD-${(marca || 'DOC').toUpperCase()}-${code}`;
}

function sanitizeNameForFile(value, fallback = 'archivo') {
  return (value || fallback)
    .trim()
    .replace(/[^a-zA-ZÀ-ÿ0-9_\-\s]/g, '')
    .replace(/\s+/g, '_');
}

export async function POST(request) {
  try {
    const missing = missingGoogleEnv();
    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Falta configurar variables para Drive/Sheets: ${missing.join(', ')}`,
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

    const marca = fields.marca || 'ciip';
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
      const cvExt = cvFile.name?.split('.').pop() || 'pdf';
      const cvName = `CV_${baseName}.${cvExt}`;
      const cvResult = await uploadFileToDrive(cvBuffer, cvName, cvFile.type, folderId);
      links.cvUrl = cvResult.fileUrl;
    }

    if (fotoFile && fotoFile.size > 0) {
      const fotoBuffer = Buffer.from(await fotoFile.arrayBuffer());
      const fotoExt = fotoFile.name?.split('.').pop() || 'jpg';
      const fotoName = `Foto_${baseName}.${fotoExt}`;
      const fotoResult = await uploadFileToDrive(fotoBuffer, fotoName, fotoFile.type, folderId);
      links.fotoUrl = fotoResult.fileUrl;
    }

    const pdfData = { ...fields, code, fecha, institucion };
    const pdfBuffer = await generateConformidadPDF(pdfData);
    const pdfName = `Conformidad_${code}.pdf`;
    const pdfResult = await uploadFileToDrive(pdfBuffer, pdfName, 'application/pdf', folderId);
    links.pdfUrl = pdfResult.fileUrl;

    await ensureSheetHeaders();
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
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Error al procesar el envío',
      },
      { status: 500 }
    );
  }
}
