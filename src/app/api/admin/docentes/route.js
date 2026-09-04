import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth.js';
import { getMongoDb, withMongoRetry, hasMongoConfig } from '@/lib/mongodb.js';
import { updateDocenteHonorarios } from '@/lib/google-sheets.js';

const CSV_COLUMNS = [
  ['codigo', 'Código'],
  ['nombre', 'Nombre'],
  ['email', 'Email'],
  ['telefono', 'Teléfono'],
  ['fechaNacimiento', 'Fecha de nacimiento'],
  ['direccion', 'Dirección de vivienda'],
  ['documento', 'DNI / Documento'],
  ['profesion', 'Profesión'],
  ['marcasTexto', 'Marca(s)'],
  ['metodoPago', 'Método de pago'],
  ['numeroCuenta', 'Número de cuenta'],
  ['honorariosHora', 'Honorarios por hora'],
  ['conformidadCompleta', 'Conformidad completa'],
  ['createdAt', 'Fecha de registro'],
  ['estado', 'Estado'],
];

function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toCsv(docentes) {
  return [
    CSV_COLUMNS.map(([, label]) => csvCell(label)).join(','),
    ...docentes.map((docente) =>
      CSV_COLUMNS.map(([key]) => csvCell(docente[key])).join(',')
    ),
  ].join('\n');
}

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
    direccion: doc.direccion || '',
    profesion: doc.profesion || '',
    marcas: doc.marcas || [],
    marcasTexto: (doc.marcas || []).join(', '),
    softwares: doc.softwares || '',
    cursoInteres: doc.cursoInteres || '',
    mejoraAdministrativa: doc.mejoraAdministrativa || '',
    comentarios: doc.comentarios || '',
    metodoPago: doc.datosPago?.metodoPagoDetalle || doc.datosPago?.metodoPago || '',
    numeroCuenta: doc.datosPago?.cuentaAbono || '',
    paisPago: doc.datosPago?.pais || '',
    monedaPago: doc.datosPago?.moneda || '',
    bancoNombre: doc.datosPago?.banco || '',
    titularCuenta: doc.datosPago?.titularCuenta || '',
    detallesPagoExtra: doc.datosPago?.detallesExtra || {},
    honorariosHora: doc.datosPago?.honorariosHora ?? null,
    cvUrl: doc.documentos?.cvUrl || '',
    fotoUrl: doc.documentos?.fotoUrl || '',
    pdfUrl: doc.documentos?.conformidadPdfUrl || '',
    folderUrl: doc.documentos?.carpetaDriveUrl || '',
    conformidadCompleta,
    createdAt: doc.createdAt?.toISOString() || '',
    updatedAt: doc.updatedAt?.toISOString() || '',
    estado: doc.estado || 'activo',
    lastSource: doc.lastSource || '',
  };
}

export async function PATCH(request) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const session = await verifyAdminToken(token);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (!hasMongoConfig()) {
    return NextResponse.json({ error: 'MongoDB no está configurado.' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || '');

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Docente inválido.' }, { status: 400 });
    }

    const db = await getMongoDb();
    const collection = db.collection('docentes');
    const objectId = new ObjectId(id);
    const current = await collection.findOne({ _id: objectId });

    if (!current) {
      return NextResponse.json({ error: 'Docente no encontrado.' }, { status: 404 });
    }

    // Actualización de datos de pago administrativos
    if (body.action === 'update_payment' || body.paymentData) {
      const p = body.paymentData || {};
      const updates = {
        updatedAt: new Date(),
      };

      if (p.metodoPago !== undefined) updates['datosPago.metodoPago'] = String(p.metodoPago || '').trim();
      if (p.metodoPagoDetalle !== undefined) updates['datosPago.metodoPagoDetalle'] = String(p.metodoPagoDetalle || '').trim();
      if (p.cuentaAbono !== undefined) updates['datosPago.cuentaAbono'] = String(p.cuentaAbono || '').trim();
      if (p.moneda !== undefined) updates['datosPago.moneda'] = String(p.moneda || '').trim().toUpperCase();
      if (p.pais !== undefined) updates['datosPago.pais'] = String(p.pais || '').trim().toLowerCase();
      if (p.banco !== undefined) updates['datosPago.banco'] = String(p.banco || '').trim();
      if (p.titularCuenta !== undefined) updates['datosPago.titularCuenta'] = String(p.titularCuenta || '').trim();
      if (p.detallesExtra !== undefined) updates['datosPago.detallesExtra'] = typeof p.detallesExtra === 'object' ? p.detallesExtra : {};

      await collection.updateOne(
        { _id: objectId },
        {
          $set: updates,
          $push: { eventos: { tipo: 'actualiza_pago_admin', at: new Date(), admin: session.sub, datos: p } },
        }
      );

      const updated = await collection.findOne({ _id: objectId });
      return NextResponse.json({ docente: normalizeMongoDocente(updated) });
    }

    // Actualización de honorarios
    const amount = Number(body.honorariosHora);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000 || Math.round(amount * 100) !== amount * 100) {
      return NextResponse.json({ error: 'Ingresa un monto válido con máximo dos decimales.' }, { status: 400 });
    }

    const honorariosHora = Number(amount.toFixed(2));
    const identity = {
      codigo: current.conformidad?.codigo,
      documento: current.documentoNumero,
      email: current.email,
    };
    const sheetUpdate = await updateDocenteHonorarios(identity, honorariosHora);

    try {
      await collection.updateOne(
        { _id: objectId },
        {
          $set: { 'datosPago.honorariosHora': honorariosHora, updatedAt: new Date() },
          $push: { eventos: { tipo: 'actualiza_honorarios', honorariosHora, at: new Date(), admin: session.sub } },
        }
      );
    } catch (mongoError) {
      await updateDocenteHonorarios(identity, sheetUpdate.previousValue);
      throw mongoError;
    }

    const updated = await collection.findOne({ _id: objectId });
    return NextResponse.json({ docente: normalizeMongoDocente(updated) });
  } catch (error) {
    return NextResponse.json({ error: `No se pudo guardar la modificación: ${error.message}` }, { status: 500 });
  }
}

export async function GET(request) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const session = await verifyAdminToken(token);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));
  const search = (searchParams.get('search') || '').trim();
  const marca = (searchParams.get('marca') || '').trim();
  const moneda = (searchParams.get('moneda') || '').trim();

  if (!hasMongoConfig()) {
    return NextResponse.json({ error: 'MongoDB no está configurado.' }, { status: 503 });
  }

  try {
    return await withMongoRetry(async (db) => {
      const query = {};

      if (search) {
        const safeSearch = escapeRegex(search);
        query.$or = [
          { searchText: { $regex: safeSearch.toLowerCase(), $options: 'i' } },
          { nombreCompleto: { $regex: safeSearch, $options: 'i' } },
          { documentoNumero: { $regex: safeSearch, $options: 'i' } },
          { email: { $regex: safeSearch, $options: 'i' } },
        ];
      }

      if (marca) {
        query.marcas = { $in: [new RegExp(`^${escapeRegex(marca)}(?: latam)?$`, 'i')] };
      }

      if (moneda) {
        query['datosPago.moneda'] = moneda.toUpperCase();
      }

      const collection = db.collection('docentes');
      const conformidadQuery = {
        ...query,
        ...Object.fromEntries(
          ['aceptaMetodologia', 'aceptaSabado', 'aceptaDomingo', 'aceptaLunes', 'aceptaProtocolo', 'aceptaAsistencia', 'aceptaTop']
            .map((key) => [`conformidad.${key}`, true])
        ),
      };
      const brandQuery = (brand) => ({
        $and: [query, { marcas: { $in: [new RegExp(`^${brand}(?: latam)?$`, 'i')] } }],
      });

      if (searchParams.get('format') === 'csv') {
        const exportDocs = await collection.find(query).sort({ createdAt: -1 }).toArray();
        const csv = toCsv(exportDocs.map(normalizeMongoDocente));
        const date = new Date().toISOString().slice(0, 10);
        return new NextResponse(`\uFEFF${csv}`, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="docentes_${date}.csv"`,
          },
        });
      }

      const [total, totalCiip, totalGeo, totalBio, totalConf] = await Promise.all([
        collection.countDocuments(query),
        collection.countDocuments(brandQuery('ciip')),
        collection.countDocuments(brandQuery('geomina')),
        collection.countDocuments(brandQuery('biomedic')),
        collection.countDocuments(conformidadQuery),
      ]);
      const docs = await collection
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
        stats: { total, ciip: totalCiip, geomina: totalGeo, biomedic: totalBio, conformidad: totalConf },
      });
    });
  } catch (error) {
    console.error('Error al obtener docentes en /api/admin/docentes:', error);
    return NextResponse.json({ error: `Error de base de datos: ${error.message}` }, { status: 500 });
  }
}
