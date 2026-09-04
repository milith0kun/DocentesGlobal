import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'contrata_docentes';

async function check() {
  console.log('Probando conexion con el cluster...');
  const client = new MongoClient(uri);
  const t0 = Date.now();
  await client.connect();
  const connectMs = Date.now() - t0;

  const db = client.db(dbName);
  const tPing0 = Date.now();
  const ping = await db.command({ ping: 1 });
  const pingMs = Date.now() - tPing0;

  const admin = client.db().admin();
  const dbs = await admin.listDatabases();

  const collections = await db.listCollections().toArray();
  const collectionStats = [];
  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    collectionStats.push({ nombre: col.name, totalDocumentos: count });
  }

  // Prueba de lectura
  const sampleDocente = await db.collection('docentes').findOne(
    {},
    { projection: { nombreCompleto: 1, documentoNumero: 1, email: 1 } }
  );

  // Prueba de escritura y eliminacion
  const testCol = db.collection('_test_health');
  await testCol.insertOne({ probe: 'ok', fecha: new Date() });
  const writeVerify = await testCol.findOne({ probe: 'ok' });
  await testCol.deleteOne({ probe: 'ok' });

  await client.close();

  console.log('\n--- RESULTADO DE LA REVISION ---');
  console.log('Estado:', 'ONLINE (Operativa)');
  console.log('Tiempo de conexion:', `${connectMs} ms`);
  console.log('Latencia del Ping:', `${pingMs} ms`);
  console.log('Respuesta Ping:', JSON.stringify(ping));
  console.log('Bases de datos en el cluster:', dbs.databases.map((d) => d.name).join(', '));
  console.log('Base de datos en uso:', dbName);
  console.log('\nColecciones y conteos:');
  collectionStats.forEach((c) => console.log(`  - ${c.nombre}: ${c.totalDocumentos} registros`));
  console.log('\nPrueba de lectura:', sampleDocente ? `EXITOSA (Ejemplo: ${sampleDocente.nombreCompleto} | DNI: ${sampleDocente.documentoNumero})` : 'Sin registros');
  console.log('Prueba de escritura:', writeVerify ? 'EXITOSA (Permisos INSERT/DELETE correctos)' : 'FALLIDA');
}

check().catch((err) => {
  console.error('ERROR AL REVISAR BASE DE DATOS:', err);
  process.exit(1);
});
