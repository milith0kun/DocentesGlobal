import { getSheetsClient } from './google-auth.js';

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SHEET_NAME = 'Docentes';
const SHEET_HEADERS = [
  'Código',
  'Nombre',
  'Correo',
  'Documento',
  'Nacimiento',
  'Institución',
  'Marca',
  'Teléfono',
  'Método Pago',
  'Cuenta',
  'Dirección',
  'Softwares',
  'Curso Deseado',
  'Mejora Admin',
  'Comentarios',
  'Acepta Metodología',
  'Acepta Sábado',
  'Acepta Domingo',
  'Acepta Lunes',
  'Acepta Protocolo',
  'Acepta Asistencia',
  'Acepta TOP',
  'Link CV',
  'Link Foto',
  'Link PDF',
  'Link Carpeta',
  'Fecha Registro',
];

function assertSheetsConfig() {
  if (!SPREADSHEET_ID) {
    throw new Error('Falta GOOGLE_SPREADSHEET_ID en variables de entorno');
  }
}

function columnLabel(index1Based) {
  let n = index1Based;
  let label = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    label = String.fromCharCode(65 + rem) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
}

function sheetRange(startCell) {
  return `${SHEET_NAME}!${startCell}`;
}

async function ensureSheetExists() {
  assertSheetsConfig();
  const sheets = getSheetsClient();

  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: 'sheets(properties(sheetId,title))',
  });

  const sheetExists = (metadata.data.sheets || []).some(
    (s) => s.properties?.title === SHEET_NAME
  );

  if (!sheetExists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
      },
    });
  }
}

/**
 * Inicializa o corrige los headers del sheet.
 */
export async function ensureSheetHeaders() {
  assertSheetsConfig();
  const sheets = getSheetsClient();
  await ensureSheetExists();

  const endCol = columnLabel(SHEET_HEADERS.length);
  const headerRange = sheetRange(`A1:${endCol}1`);

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: headerRange,
  });

  const current = existing.data.values?.[0] || [];
  const needsUpdate =
    current.length !== SHEET_HEADERS.length ||
    SHEET_HEADERS.some((h, i) => current[i] !== h);

  if (needsUpdate) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: headerRange,
      valueInputOption: 'RAW',
      requestBody: {
        values: [SHEET_HEADERS],
      },
    });
  }
}

/**
 * Agrega una fila con los datos del docente al Google Sheet.
 * @param {object} data - Datos del docente
 * @param {object} links - Enlaces de Drive { cvUrl, fotoUrl, pdfUrl, folderUrl }
 */
export async function appendDocenteRow(data, links = {}) {
  assertSheetsConfig();
  const sheets = getSheetsClient();

  const metodo = data.metodoPago === 'otro' ? data.metodoPagoOtro : data.metodoPago;

  const row = [
    data.code || '',
    data.nombre || '',
    data.correo || '',
    data.documento || '',
    data.fechaNacimiento || '',
    data.institucion || '',
    data.marca || '',
    data.telefono || '',
    metodo || '',
    data.numeroCuenta || '',
    data.direccion || '',
    data.softwares || '',
    data.cursoSonado || '',
    data.mejoraAdmin || '',
    data.comentarios || '',
    data.aceptaMetodologia || '',
    data.aceptaSabado || '',
    data.aceptaDomingo || '',
    data.aceptaLunes || '',
    data.aceptaProtocolo || '',
    data.aceptaAsistencia || '',
    data.aceptaTop || '',
    links.cvUrl || '',
    links.fotoUrl || '',
    links.pdfUrl || '',
    links.folderUrl || '',
    new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' }),
  ];

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetRange('A1'),
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });

  return {
    updatedRange: response.data.updates?.updatedRange,
    updatedRows: response.data.updates?.updatedRows,
  };
}
