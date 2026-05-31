import { getSheetsClient } from './google-auth.js';

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Docentes';
const SHEET_GID = process.env.GOOGLE_SHEET_GID;

const LEGACY_COLUMN_COUNT = 32;

function assertSheetsConfig() {
  if (!SPREADSHEET_ID) {
    throw new Error('Falta GOOGLE_SPREADSHEET_ID en variables de entorno');
  }
}

function quoteSheetName(name) {
  return `'${String(name).replace(/'/g, "''")}'`;
}

function normalizeHeader(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function booleanText(value) {
  return value === true || value === 'true' ? 'Si' : 'No';
}

function paymentMethod(data) {
  return data.metodoPago === 'otro' ? data.metodoPagoOtro : data.metodoPago;
}

function safeSheetText(value) {
  const text = String(value || '');
  return /^[=+\-@]/.test(text.trimStart()) ? `'${text}` : text;
}

function safeRowValues(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, safeSheetText(value)])
  );
}

function rowValues(data, links) {
  const metodo = paymentMethod(data);
  const timestamp = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

  return safeRowValues({
    adminObservaciones: '',
    timestamp,
    correo: data.correo || '',
    nombre: data.nombre || '',
    institucion: data.institucion || '',
    fechaNacimiento: data.fechaNacimiento || '',
    telefono: data.telefono || '',
    metodoPago: metodo || '',
    numeroCuenta: data.numeroCuenta || '',
    profesion: data.profesion || '',
    cv: links.cvUrl || '',
    foto: links.fotoUrl || '',
    comentarios: data.comentarios || '',
    cursoSonado: data.cursoSonado || '',
    mejoraAdmin: data.mejoraAdmin || '',
    softwares: data.softwares || '',
    documento: data.documento || '',
    direccion: data.direccion || '',
    domicilio: data.domicilio || '',
    resumenDocente: data.resumenDocente || '',
    honorarios: data.honorarios || '',
    columna1: '',
    code: data.code || '',
    aceptaMetodologia: booleanText(data.aceptaMetodologia),
    aceptaProtocolo: booleanText(data.aceptaProtocolo),
    aceptaAsistencia: booleanText(data.aceptaAsistencia),
    aceptaTop: booleanText(data.aceptaTop),
    aceptaSabado: booleanText(data.aceptaSabado),
    aceptaDomingo: booleanText(data.aceptaDomingo),
    aceptaLunes: booleanText(data.aceptaLunes),
    folderUrl: links.folderUrl || '',
    marca: data.marca || '',
    pdf: links.pdfUrl || '',
  });
}

const HEADER_MATCHERS = [
  { key: 'adminObservaciones', aliases: ['observaciones'] },
  { key: 'timestamp', aliases: ['marca temporal', 'timestamp', 'fecha de envio'] },
  {
    key: 'correo',
    aliases: ['direccion de correo electronico', 'correo electronico', 'email', 'correo'],
  },
  { key: 'nombre', aliases: ['1 nombre completo', 'nombre completo', 'nombres y apellidos'] },
  {
    key: 'institucion',
    aliases: ['3 institucion a la que pertenece', 'institucion a la que pertenece', 'institucion'],
  },
  {
    key: 'fechaNacimiento',
    aliases: ['4 fecha de nacimiento', 'fecha de nacimiento', 'nacimiento'],
  },
  {
    key: 'telefono',
    aliases: [
      '5 numero de contacto preferente whatsapp',
      'numero de contacto preferente whatsapp',
      'whatsapp',
      'telefono',
      'celular',
    ],
  },
  {
    key: 'metodoPago',
    aliases: ['6 cuenta de abono preferente', 'cuenta de abono preferente', 'metodo de pago'],
  },
  {
    key: 'numeroCuenta',
    aliases: [
      '8 numero de cuenta o celular asociado al abono',
      'numero de cuenta o celular asociado al abono',
      'numero de cuenta',
      'cuenta bancaria',
    ],
  },
  { key: 'profesion', aliases: ['profesion'] },
  {
    key: 'cv',
    aliases: ['adjuntar curriculum vitae cv actualizado', 'curriculum vitae', 'cv actualizado', 'cv'],
  },
  {
    key: 'foto',
    aliases: ['adjuntar fotografia profesional', 'fotografia profesional', 'foto profesional', 'foto'],
  },
  {
    key: 'comentarios',
    aliases: ['tiene alguna observacion', 'comentarios adicionales', 'comentarios'],
  },
  {
    key: 'cursoSonado',
    aliases: ['reto profesional y personal', 'curso o especializacion', 'curso sonado'],
  },
  {
    key: 'mejoraAdmin',
    aliases: ['desde su perspectiva como docente', 'mejora administrativa', 'mejora admin'],
  },
  {
    key: 'softwares',
    aliases: ['indique los softwares especializados', 'softwares especializados', 'softwares'],
  },
  {
    key: 'documento',
    aliases: ['2 documento identidad', 'documento identidad', 'documento de identidad', 'dni'],
  },
  {
    key: 'direccion',
    aliases: ['7 direccion de vivienda', 'direccion de vivienda', 'direccion'],
  },
  { key: 'domicilio', aliases: ['domicilio'] },
  { key: 'resumenDocente', aliases: ['resumen docente'] },
  { key: 'honorarios', aliases: ['honorarios'] },
  { key: 'columna1', aliases: ['columna 1'] },
  { key: 'code', aliases: ['codigo sistema', 'codigo', 'id sistema'] },
  { key: 'aceptaMetodologia', aliases: ['acepta metodologia', 'metodologia doing by learning'] },
  { key: 'aceptaProtocolo', aliases: ['acepta protocolo', 'protocolo de imagen'] },
  { key: 'aceptaAsistencia', aliases: ['acepta asistencia', 'politica de asistencia'] },
  { key: 'aceptaTop', aliases: ['acepta top', 'programa docente top'] },
  { key: 'aceptaSabado', aliases: ['disponibilidad sabado', 'acepta sabado', 'sabado'] },
  { key: 'aceptaDomingo', aliases: ['disponibilidad domingo', 'acepta domingo', 'domingo'] },
  { key: 'aceptaLunes', aliases: ['disponibilidad lunes', 'acepta lunes', 'lunes'] },
  { key: 'folderUrl', aliases: ['link carpeta docente', 'carpeta docente', 'carpeta drive'] },
  { key: 'marca', aliases: ['marca', 'ecosistema'] },
  { key: 'pdf', aliases: ['pdf', 'conformidad pdf', 'declaracion pdf'] },
];

function resolveValueForHeader(header, values) {
  const normalized = normalizeHeader(header);
  if (!normalized) return '';

  for (const matcher of HEADER_MATCHERS) {
    if (matcher.aliases.some((alias) => normalized === alias)) {
      return values[matcher.key] ?? '';
    }
  }

  let bestMatch = null;
  for (const matcher of HEADER_MATCHERS) {
    for (const alias of matcher.aliases) {
      if (normalized.includes(alias) && (!bestMatch || alias.length > bestMatch.alias.length)) {
        bestMatch = { matcher, alias };
      }
    }
  }

  return bestMatch ? values[bestMatch.matcher.key] ?? '' : '';
}

function buildLegacyRow(values) {
  const row = Array.from({ length: LEGACY_COLUMN_COUNT }, () => '');
  row[0] = values.adminObservaciones;
  row[1] = values.timestamp;
  row[2] = values.correo;
  row[3] = values.nombre;
  row[4] = values.institucion;
  row[5] = values.fechaNacimiento;
  row[6] = values.telefono;
  row[7] = values.metodoPago;
  row[8] = values.numeroCuenta;
  row[9] = values.profesion;
  row[10] = values.cv;
  row[11] = values.foto;
  row[12] = values.comentarios;
  row[13] = values.cursoSonado;
  row[14] = values.mejoraAdmin;
  row[15] = values.softwares;
  row[16] = values.documento;
  row[17] = values.direccion;
  row[18] = values.domicilio;
  row[19] = values.resumenDocente;
  row[20] = values.honorarios;
  row[21] = values.columna1;
  row[22] = values.code;
  row[23] = values.aceptaMetodologia;
  row[24] = values.aceptaProtocolo;
  row[25] = values.aceptaAsistencia;
  row[26] = values.aceptaTop;
  row[27] = values.aceptaSabado;
  row[28] = values.aceptaDomingo;
  row[29] = values.aceptaLunes;
  row[30] = values.folderUrl;
  row[31] = values.marca;
  return row;
}

async function resolveSheetName(sheets) {
  if (!SHEET_GID) return SHEET_NAME;

  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: 'sheets(properties(sheetId,title))',
  });

  const target = meta.data.sheets?.find(
    (sheet) => String(sheet.properties?.sheetId) === String(SHEET_GID)
  );

  if (!target?.properties?.title) {
    throw new Error(`No se encontro una pestana con gid ${SHEET_GID}`);
  }

  return target.properties.title;
}

async function getSheetValues(sheets, sheetName) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${quoteSheetName(sheetName)}!A:ZZ`,
  });

  return response.data.values || [];
}

function isLikelyHeaderRow(row = []) {
  const normalized = row.map((cell) => normalizeHeader(cell));
  return (
    normalized.includes('marca temporal') &&
    normalized.some((cell) => cell.includes('direccion de correo electronico')) &&
    normalized.some((cell) => cell.includes('nombre completo'))
  );
}

function findHeaderIndex(rows) {
  const index = rows.findIndex(isLikelyHeaderRow);
  return index >= 0 ? index : 0;
}

function isEmptyRow(row = []) {
  return row.every((cell) => !String(cell || '').trim());
}

function findNextResponseRow(rows, headerIndex) {
  for (let index = headerIndex + 1; index < rows.length; index += 1) {
    if (isEmptyRow(rows[index])) {
      return index + 1;
    }
  }

  return rows.length + 1;
}

export async function appendDocenteRow(data, links = {}) {
  assertSheetsConfig();
  const sheets = getSheetsClient();
  const sheetName = await resolveSheetName(sheets);
  const values = rowValues(data, links);
  const rows = await getSheetValues(sheets, sheetName);
  const headerIndex = findHeaderIndex(rows);
  const headers = rows[headerIndex] || [];
  const targetRow = findNextResponseRow(rows, headerIndex);
  const row = headers.length > 0
    ? headers.map((header) => resolveValueForHeader(header, values))
    : buildLegacyRow(values);

  const response = await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${quoteSheetName(sheetName)}!A${targetRow}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });

  return {
    updatedRange: response.data.updatedRange,
    updatedRows: response.data.updatedRows,
  };
}
