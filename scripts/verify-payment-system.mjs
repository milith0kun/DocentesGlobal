import { MongoClient, ObjectId } from 'mongodb';
import { PAYMENT_REGIONS, findMethodConfig, formatPaymentSummary } from '../src/components/wizard/config/payment-config.js';

const URI = 'mongodb://grupocgblatam_db_user:jampier1997281qA@ac-hch6tnu-shard-00-00.losigdp.mongodb.net:27017,ac-hch6tnu-shard-00-01.losigdp.mongodb.net:27017,ac-hch6tnu-shard-00-02.losigdp.mongodb.net:27017/?ssl=true&replicaSet=atlas-9ttg3j-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'contrata_docentes';

async function runTests() {
  console.log('--- 1. Probando configuración de pagos y helpers ---');
  console.log(`Total regiones configuradas: ${PAYMENT_REGIONS.length}`);
  PAYMENT_REGIONS.forEach((r) => {
    console.log(`  - [${r.flag}] ${r.name}: ${r.methods.length} métodos disponibles (Moneda def: ${r.defaultCurrency})`);
  });

  const zelle = findMethodConfig('zelle_global');
  console.log('Test findMethodConfig(zelle_global):', zelle?.label, '| Moneda:', zelle?.currency, '| Requiere titular:', zelle?.requiresHolder);

  const swift = findMethodConfig('swift_usd');
  console.log('Test findMethodConfig(swift_usd):', swift?.label, '| Requiere SWIFT:', swift?.requiresSwift);

  const testSummary = formatPaymentSummary({
    metodoPago: 'zelle_global',
    monedaPago: 'USD',
  });
  console.log('Test formatPaymentSummary:', testSummary);

  console.log('\n--- 2. Probando conexión a MongoDB e inserción/actualización de pago estructurado ---');
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection('docentes');

  const testDocenteId = new ObjectId();
  const testDocente = {
    _id: testDocenteId,
    documentoTipo: 'DNI',
    documentoNumero: '99887766',
    nombreCompleto: 'Docente Prueba Multimoneda',
    email: 'test.multimoneda@ejemplo.com',
    telefono: '+15550199',
    marcas: ['ciip'],
    datosPago: {
      metodoPago: 'zelle_global',
      metodoPagoDetalle: 'Zelle (USD)',
      cuentaAbono: 'docente.zelle@ejemplo.com',
      moneda: 'USD',
      pais: 'norteamerica',
      banco: 'Chase Bank',
      titularCuenta: 'Docente Titular Zelle',
      detallesExtra: { tipoCuenta: 'Ahorros' },
      honorariosHora: 45.0,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSource: 'test-suite',
  };

  await collection.insertOne(testDocente);
  console.log('Docente de prueba insertado con ID:', testDocenteId.toString());

  // Probar lectura
  const doc = await collection.findOne({ _id: testDocenteId });
  console.log('Datos de pago leídos de MongoDB:', {
    metodo: doc.datosPago.metodoPago,
    detalle: doc.datosPago.metodoPagoDetalle,
    cuenta: doc.datosPago.cuentaAbono,
    moneda: doc.datosPago.moneda,
    pais: doc.datosPago.pais,
    titular: doc.datosPago.titularCuenta,
  });

  // Probar actualización de pago administrativo (simulando PATCH)
  console.log('\n--- 3. Probando actualización administrativa de pago (PATCH simulation) ---');
  const updateResult = await collection.updateOne(
    { _id: testDocenteId },
    {
      $set: {
        'datosPago.metodoPago': 'swift_usd',
        'datosPago.metodoPagoDetalle': 'Transferencia SWIFT (USD)',
        'datosPago.cuentaAbono': 'US9876543210',
        'datosPago.moneda': 'USD',
        'datosPago.pais': 'internacional',
        'datosPago.banco': 'Bank of America',
        'datosPago.titularCuenta': 'Docente Titular Internacional',
        'datosPago.detallesExtra': { swift: 'BOFAUS3N' },
        updatedAt: new Date(),
      },
      $push: {
        eventos: {
          tipo: 'actualiza_pago_admin',
          at: new Date(),
          admin: 'cgbacademy',
        },
      },
    }
  );
  console.log('Resultado actualización:', updateResult.modifiedCount === 1 ? 'OK' : 'FALLIDO');

  const updatedDoc = await collection.findOne({ _id: testDocenteId });
  console.log('Docente actualizado con nuevos datos bancarios:', {
    metodo: updatedDoc.datosPago.metodoPago,
    banco: updatedDoc.datosPago.banco,
    cuenta: updatedDoc.datosPago.cuentaAbono,
    swift: updatedDoc.datosPago.detallesExtra?.swift,
    totalEventos: updatedDoc.eventos?.length,
  });

  // Limpiar registro de prueba
  await collection.deleteOne({ _id: testDocenteId });
  console.log('\nRegistro de prueba eliminado de la base de datos limpiamente.');

  await client.close();
  console.log('\n¡Todas las pruebas pasaron satisfactoriamente!');
}

runTests().catch((err) => {
  console.error('Error en pruebas:', err);
  process.exit(1);
});
