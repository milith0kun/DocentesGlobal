import { getSheetsClient } from './google-auth.js';

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Docentes';
const SHEET_GID = process.env.GOOGLE_SHEET_GID;

const MAX_WRITE_RETRIES = 3;

export const SHEET_COLUMNS = [
  ['timestamp', 'Fecha de registro'],
  ['code', 'Código docente'],
  ['nombre', 'Nombre completo'],
  ['documento', 'Documento de identidad'],
  ['correo', 'Correo electrónico'],
  ['telefono', 'Teléfono / WhatsApp'],
  ['fechaNacimiento', 'Fecha de nacimiento'],
  ['direccion', 'Dirección de vivienda'],
  ['marca', 'Marca(s)'],
  ['profesion', 'Profesión'],
  ['softwares', 'Softwares especializados'],
  ['metodoPago', 'Método de pago'],
  ['numeroCuenta', 'Cuenta de abono'],
  ['honorarios', 'Honorarios por hora (administrativo)'],
  ['cv', 'Enlace al CV'],
  ['foto', 'Enlace a la fotografía'],
  ['cursoSonado', 'Curso o especialización propuesta'],
  ['mejoraAdmin', 'Mejora académica o administrativa'],
  ['comentarios', 'Comentarios del docente'],
  ['pdf', 'Enlace al contrato PDF'],
  ['observacionesAdmin', 'Observaciones administrativas'],
];

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

function paymentMethod(data) {
  return data.metodoPago === 'otro' ? data.metodoPagoOtro : data.metodoPago;
}

function brandNames(value) {
  const labels = { ciip: 'CIIP Latam', geomina: 'Geomina', biomedic: 'Biomedic' };
  return String(value || '')
    .split(',')
    .map((brand) => labels[brand.trim()] || brand.trim())
    .filter(Boolean)
    .join(' & ');
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
    timestamp,
    correo: data.correo || '',
    nombre: data.nombre || '',
    institucion: data.institucion || '',
    fechaNacimiento: data.fechaNacimiento || '',
    telefono: data.telefono || '',
    metodoPago: metodo || '',
    numeroCuenta: data.numeroCuenta || '',
    marca: brandNames(data.marca),
    profesion: data.profesion || '',
    cv: links.cvUrl || '',
    foto: links.fotoUrl || '',
    comentarios: data.comentarios || '',
    cursoSonado: data.cursoSonado || '',
    mejoraAdmin: data.mejoraAdmin || '',
    softwares: data.softwares || '',
    documento: data.documento || '',
    direccion: data.direccion || '',
    honorarios: data.honorarios || '',
    code: data.code || '',
    pdf: links.pdfUrl || '',
    observacionesAdmin: '',
  });
}

const HEADER_MATCHERS = [
  { key: 'timestamp', aliases: ['fecha de registro', 'marca temporal', 'timestamp', 'fecha de envio'] },
  {
    key: 'correo',
    aliases: ['direccion de correo electronico', 'correo electronico', 'email', 'correo'],
  },
  { key: 'nombre', aliases: ['1 nombre completo', 'nombre completo', 'nombres y apellidos'] },
  { key: 'marca', aliases: ['marca s', 'marca', 'marcas'] },
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
  { key: 'honorarios', aliases: ['monto honorarios', 'monto', 'honorarios'] },
  { key: 'code', aliases: ['codigo sistema', 'codigo', 'id sistema'] },
  { key: 'pdf', aliases: ['pdf de conformidad', 'pdf', 'conformidad pdf', 'declaracion pdf'] },
  { key: 'observacionesAdmin', aliases: ['observaciones administrativas', 'observaciones admin'] },
];

function resolveHeaderKey(header) {
  const normalized = normalizeHeader(header);
  if (!normalized) return null;

  const exactMatch = HEADER_MATCHERS.find((matcher) => matcher.aliases.includes(normalized));
  if (exactMatch) return exactMatch.key;

  let bestMatch = null;
  for (const matcher of HEADER_MATCHERS) {
    for (const alias of matcher.aliases) {
      if (normalized.includes(alias) && (!bestMatch || alias.length > bestMatch.alias.length)) {
        bestMatch = { key: matcher.key, alias };
      }
    }
  }

  return bestMatch?.key || null;
}

function resolveValueForHeader(header, values) {
  const key = resolveHeaderKey(header);
  return key ? values[key] ?? '' : '';
}

function buildDefaultRow(values) {
  return SHEET_COLUMNS.map(([key]) => values[key] ?? '');
}

function columnLetter(index) {
  let value = index + 1;
  let result = '';
  while (value > 0) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }
  return result;
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

async function getRowValues(sheets, sheetName, rowNumber) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${quoteSheetName(sheetName)}!A${rowNumber}:ZZ${rowNumber}`,
  });

  return response.data.values?.[0] || [];
}

function isLikelyHeaderRow(row = []) {
  const normalized = row.map((cell) => normalizeHeader(cell));
  return (
    (normalized.includes('marca temporal') || normalized.includes('fecha de registro')) &&
    normalized.some((cell) => cell.includes('correo electronico')) &&
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

function columnIndex(headers, key, fallback) {
  const index = headers.findIndex((header) => resolveHeaderKey(header) === key);
  return index >= 0 ? index : fallback;
}

function isLikelyResponseRow(row = [], headers = []) {
  const correo = String(row[columnIndex(headers, 'correo', 2)] || '').trim();
  const nombre = String(row[columnIndex(headers, 'nombre', 3)] || '').trim();
  const cv = String(row[columnIndex(headers, 'cv', 10)] || '').trim();
  const foto = String(row[columnIndex(headers, 'foto', 11)] || '').trim();
  const hasFiles = Boolean(cv || foto);

  return (/^\S+@\S+\.\S{2,}$/.test(correo) && Boolean(nombre)) || (Boolean(nombre) && hasFiles);
}

function findNextResponseTarget(rows, headerIndex) {
  let lastDataRow = headerIndex + 1;
  const headers = rows[headerIndex] || [];

  for (let index = headerIndex + 1; index < rows.length; index += 1) {
    if (isLikelyResponseRow(rows[index], headers)) {
      lastDataRow = index + 1;
    }
  }

  return {
    targetRow: lastDataRow + 1,
    formatSourceRow: lastDataRow > headerIndex + 1 ? lastDataRow : null,
  };
}

async function copyRowFormat(sheets, sourceRow, targetRow, columnCount) {
  if (!SHEET_GID || sourceRow < 1 || targetRow < 1 || sourceRow === targetRow) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          copyPaste: {
            source: {
              sheetId: Number(SHEET_GID),
              startRowIndex: sourceRow - 1,
              endRowIndex: sourceRow,
              startColumnIndex: 0,
              endColumnIndex: columnCount,
            },
            destination: {
              sheetId: Number(SHEET_GID),
              startRowIndex: targetRow - 1,
              endRowIndex: targetRow,
              startColumnIndex: 0,
              endColumnIndex: columnCount,
            },
            pasteType: 'PASTE_FORMAT',
            pasteOrientation: 'NORMAL',
          },
        },
      ],
    },
  });
}

export async function appendDocenteRow(data, links = {}) {
  assertSheetsConfig();
  const sheets = getSheetsClient();
  const sheetName = await resolveSheetName(sheets);
  const values = rowValues(data, links);

  for (let attempt = 1; attempt <= MAX_WRITE_RETRIES; attempt += 1) {
    const rows = await getSheetValues(sheets, sheetName);
    const headerIndex = findHeaderIndex(rows);
    const headers = rows[headerIndex] || [];
    const { targetRow, formatSourceRow } = findNextResponseTarget(rows, headerIndex);
    const existingRow = await getRowValues(sheets, sheetName, targetRow);

    if (!isEmptyRow(existingRow)) {
      if (attempt === MAX_WRITE_RETRIES) {
        throw new Error(`La fila destino ${targetRow} ya tiene datos. No se escribio para evitar sobrescritura.`);
      }
      continue;
    }

    const row = headers.length > 0
      ? headers.map((header) => resolveValueForHeader(header, values))
      : buildDefaultRow(values);

    await copyRowFormat(sheets, formatSourceRow, targetRow, Math.max(headers.length, row.length));

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${quoteSheetName(sheetName)}!A${targetRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    return {
      targetRow,
      updatedRange: response.data.updatedRange,
      updatedRows: response.data.updatedRows,
    };
  }

  throw new Error('No se pudo encontrar una fila segura para guardar la respuesta.');
}

export async function clearDocenteRow(rowNumber) {
  assertSheetsConfig();
  const sheets = getSheetsClient();
  const sheetName = await resolveSheetName(sheets);
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `${quoteSheetName(sheetName)}!A${rowNumber}:U${rowNumber}`,
  });
}

export async function updateDocenteHonorarios(identity, honorariosHora) {
  assertSheetsConfig();
  const sheets = getSheetsClient();
  const sheetName = await resolveSheetName(sheets);
  const rows = await getSheetValues(sheets, sheetName);
  const headerIndex = findHeaderIndex(rows);
  const headers = rows[headerIndex] || [];
  const honorariosColumn = columnIndex(headers, 'honorarios', -1);

  if (honorariosColumn < 0) {
    throw new Error('La columna de honorarios no existe en Google Sheets.');
  }

  const identityColumns = [
    ['code', identity.codigo],
    ['documento', identity.documento],
    ['correo', identity.email],
  ].map(([key, value]) => ({
    column: columnIndex(headers, key, -1),
    value: String(value || '').trim().toLowerCase(),
  })).filter(({ column, value }) => column >= 0 && value);

  const rowIndex = rows.findIndex((row, index) =>
    index > headerIndex && identityColumns.some(({ column, value }) =>
      String(row[column] || '').trim().toLowerCase() === value
    )
  );

  if (rowIndex < 0) {
    throw new Error('No se encontró al docente en Google Sheets.');
  }

  const previousValue = rows[rowIndex]?.[honorariosColumn] ?? '';
  const rowNumber = rowIndex + 1;
  const cell = `${columnLetter(honorariosColumn)}${rowNumber}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${quoteSheetName(sheetName)}!${cell}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[honorariosHora]] },
  });

  return { cell, previousValue };
}

export async function readAllDocentes() {
  assertSheetsConfig();
  const sheets = getSheetsClient();
  const sheetName = await resolveSheetName(sheets);
  const rows = await getSheetValues(sheets, sheetName);
  const headerIndex = findHeaderIndex(rows);
  const headers = rows[headerIndex] || [];

  const docentes = [];
  for (let i = headerIndex + 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (!isLikelyResponseRow(row, headers)) continue;

    const data = {};
    headers.forEach((header, colIdx) => {
      const key = resolveHeaderKey(header);
      if (key) data[key] = String(row[colIdx] || '').trim();
    });

    docentes.push({
      id: `sheet_row_${i + 1}`,
      source: 'sheets',
      rowIndex: i + 1,
      codigo: data.code || '',
      nombre: data.nombre || '',
      documento: data.documento || '',
      email: data.correo || '',
      telefono: data.telefono || '',
      fechaNacimiento: data.fechaNacimiento || '',
      profesion: data.profesion || '',
      marcas: data.marca ? data.marca.split('&').map((item) => item.trim()) : [],
      softwares: data.softwares || '',
      cursoInteres: data.cursoSonado || '',
      mejoraAdministrativa: data.mejoraAdmin || '',
      comentarios: data.comentarios || '',
      metodoPago: data.metodoPago || '',
      numeroCuenta: data.numeroCuenta || '',
      honorariosHora: data.honorarios ? Number(data.honorarios) : null,
      cvUrl: data.cv || '',
      fotoUrl: data.foto || '',
      pdfUrl: data.pdf || '',
      conformidadCompleta: Boolean(data.pdf),
      timestamp: data.timestamp || '',
      estado: 'activo',
    });
  }

  return docentes;
}
