import { getMongoDb, hasMongoConfig } from './mongodb.js';

function cleanText(value) {
  return String(value || '').trim();
}

function normalizeEmail(value) {
  return cleanText(value).toLowerCase();
}

function parseFechaNacimiento(value) {
  const text = cleanText(value);
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function selectedMarcas(value) {
  return cleanText(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function paymentMethod(data) {
  if (data.metodoPago === 'otro') {
    return data.metodoPagoOtro || 'Otro';
  }
  const bankOrMethod = data.bancoNombre || data.metodoPago || '';
  const currency = data.monedaPago ? ` (${data.monedaPago})` : '';
  return `${bankOrMethod}${currency}`.trim() || data.metodoPago;
}

function parseDetallesExtra(extra) {
  if (!extra) return {};
  if (typeof extra === 'object') return extra;
  try {
    return JSON.parse(extra);
  } catch {
    return {};
  }
}

function buildSearchText(parts) {
  return parts
    .map((part) => cleanText(part).toLowerCase())
    .filter(Boolean)
    .join(' ');
}

function buildDocenteUpdate(data, links = {}, source) {
  const documentoNumero = cleanText(data.documento);
  const email = normalizeEmail(data.correo);
  const now = new Date();

  const docente = {
    documentoTipo: documentoNumero.length === 8 ? 'DNI' : 'DOCUMENTO',
    documentoNumero,
    nombreCompleto: cleanText(data.nombre),
    email,
    telefono: cleanText(data.telefono),
    fechaNacimientoTexto: cleanText(data.fechaNacimiento),
    fechaNacimiento: parseFechaNacimiento(data.fechaNacimiento),
    direccion: cleanText(data.direccion || data.domicilio),
    profesion: cleanText(data.profesion),
    softwares: cleanText(data.softwares),
    cursoInteres: cleanText(data.cursoSonado),
    mejoraAdministrativa: cleanText(data.mejoraAdmin),
    comentarios: cleanText(data.comentarios),
    marcas: selectedMarcas(data.marca),
    'datosPago.metodoPago': cleanText(data.metodoPago),
    'datosPago.metodoPagoDetalle': cleanText(paymentMethod(data)),
    'datosPago.metodoPagoOtro': cleanText(data.metodoPagoOtro),
    'datosPago.cuentaAbono': cleanText(data.numeroCuenta),
    'datosPago.pais': cleanText(data.paisPago),
    'datosPago.moneda': cleanText(data.monedaPago || 'USD'),
    'datosPago.banco': cleanText(data.bancoNombre),
    'datosPago.titularCuenta': cleanText(data.titularCuenta),
    'datosPago.detallesExtra': parseDetallesExtra(data.detallesPagoExtra),
    documentos: {
      cvUrl: cleanText(links.cvUrl || data.cv),
      fotoUrl: cleanText(links.fotoUrl || data.foto),
      carpetaDriveUrl: cleanText(links.folderUrl || data.folderUrl),
      conformidadPdfUrl: cleanText(links.pdfUrl || data.pdf),
    },
    conformidad: {
      codigo: cleanText(data.code),
      aceptaMetodologia: data.aceptaMetodologia === true || data.aceptaMetodologia === 'true' || data.aceptaMetodologia === 'Si',
      aceptaSabado: data.aceptaSabado === true || data.aceptaSabado === 'true' || data.aceptaSabado === 'Si',
      aceptaDomingo: data.aceptaDomingo === true || data.aceptaDomingo === 'true' || data.aceptaDomingo === 'Si',
      aceptaLunes: data.aceptaLunes === true || data.aceptaLunes === 'true' || data.aceptaLunes === 'Si',
      aceptaProtocolo: data.aceptaProtocolo === true || data.aceptaProtocolo === 'true' || data.aceptaProtocolo === 'Si',
      aceptaAsistencia: data.aceptaAsistencia === true || data.aceptaAsistencia === 'true' || data.aceptaAsistencia === 'Si',
      aceptaTop: data.aceptaTop === true || data.aceptaTop === 'true' || data.aceptaTop === 'Si',
    },
    searchText: buildSearchText([data.documento, data.nombre, data.correo, data.telefono, data.marca]),
    updatedAt: now,
    lastSource: source,
  };

  return {
    $set: docente,
    $setOnInsert: {
      createdAt: now,
      estado: 'activo',
    },
    $push: {
      eventos: {
        tipo: 'upsert_docente',
        source,
        codigo: cleanText(data.code),
        at: now,
      },
    },
  };
}

export async function ensureDocenteIndexes(db) {
  const desired = [
    [db.collection('docentes'), { documentoNumero: 1 }, { unique: true, sparse: true }],
    [db.collection('docentes'), { email: 1 }, {}],
    [db.collection('docentes'), { marcas: 1 }, {}],
    [db.collection('importaciones'), { createdAt: -1 }, {}],
  ];

  for (const [collection, key, options] of desired) {
    let indexes = [];
    try {
      indexes = await collection.listIndexes().toArray();
    } catch (error) {
      if (error.code !== 26) throw error;
    }

    const keyEntries = Object.entries(key);
    const exists = indexes.some((index) => {
      const entries = Object.entries(index.key || {});
      return entries.length === keyEntries.length && entries.every(
        ([field, direction], position) => field === keyEntries[position][0] && direction === keyEntries[position][1]
      );
    });

    if (!exists) await collection.createIndex(key, options);
  }
}

export async function upsertDocente(data, links = {}, { source = 'manual-docentes' } = {}) {
  if (!hasMongoConfig()) {
    return { skipped: true, reason: 'MONGODB_URI no configurado' };
  }

  const db = await getMongoDb();
  await ensureDocenteIndexes(db);

  const documentoNumero = cleanText(data.documento);
  const email = normalizeEmail(data.correo);
  const filter = documentoNumero ? { documentoNumero } : { email };

  if (!filter.documentoNumero && !filter.email) {
    throw new Error('No se puede guardar docente en MongoDB sin documento ni correo');
  }

  const result = await db.collection('docentes').updateOne(
    filter,
    buildDocenteUpdate(data, links, source),
    { upsert: true }
  );

  return {
    skipped: false,
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    upsertedId: result.upsertedId,
  };
}
