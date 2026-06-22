import { NextResponse } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth.js';
import { getMongoDb, hasMongoConfig } from '@/lib/mongodb.js';
import { readAllDocentes } from '@/lib/google-sheets.js';

function normalizeMongoDocente(doc) {
  const conf = doc.conformidad || {};
  const boolFields = ['aceptaMetodologia', 'aceptaSabado', 'aceptaDomingo', 'aceptaLunes', 'aceptaProtocolo', 'aceptaAsistencia', 'aceptaTop'];
  const conformidadCompleta = boolFields.every((k) => conf[k] === true);

  return {
    id: String(doc._id),
    source: 'mongodb',
    codigo: conf.codigo || '',
    nombre: doc.nombreCompleto || '',
    documento: doc.documentoNumero || '',
    email: doc.email || '',
    telefono: doc.telefono || '',
    fechaNacimiento: doc.fechaNacimientoTexto || '',
    profesion: doc.profesion || '',
    institucion: doc.institucion || '',
    marcas: doc.marcas || [],
    softwares: doc.softwares || '',
    cursoInteres: doc.cursoInteres || '',
    mejoraAdministrativa: doc.mejoraAdministrativa || '',
    comentarios: doc.comentarios || '',
    metodoPago: doc.datosPago?.metodoPagoDetalle || doc.datosPago?.metodoPago || '',
    numeroCuenta: doc.datosPago?.cuentaAbono || '',
    cvUrl: doc.documentos?.cvUrl || '',
    fotoUrl: doc.documentos?.fotoUrl || '',
    pdfUrl: doc.documentos?.conformidadPdfUrl || '',
    folderUrl: doc.documentos?.carpetaDriveUrl || '',
    conformidad: conf,
    conformidadCompleta,
    createdAt: doc.createdAt?.toISOString() || '',
    updatedAt: doc.updatedAt?.toISOString() || '',
    estado: doc.estado || 'activo',
    lastSource: doc.lastSource || '',
  };
}

export async function GET(request) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const session = await verifyAdminToken(token);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'mongodb';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));
  const search = (searchParams.get('search') || '').trim();
  const marca = (searchParams.get('marca') || '').trim();

  if (source === 'sheets') {
    try {
      const docentes = await readAllDocentes();
      return NextResponse.json({ docentes, total: docentes.length, source: 'sheets' });
    } catch (error) {
      return NextResponse.json({ error: `Error al leer Google Sheets: ${error.message}` }, { status: 500 });
    }
  }

  if (!hasMongoConfig()) {
    return NextResponse.json({ error: 'MongoDB no está configurado.' }, { status: 503 });
  }

  try {
    const db = await getMongoDb();
    const query = {};

    if (search) {
      query.$or = [
        { searchText: { $regex: search.toLowerCase(), $options: 'i' } },
        { nombreCompleto: { $regex: search, $options: 'i' } },
        { documentoNumero: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (marca) {
      query.marcas = { $in: [marca] };
    }

    const total = await db.collection('docentes').countDocuments(query);
    const docs = await db
      .collection('docentes')
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      docentes: docs.map(normalizeMongoDocente),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      source: 'mongodb',
    });
  } catch (error) {
    return NextResponse.json({ error: `Error de base de datos: ${error.message}` }, { status: 500 });
  }
}
