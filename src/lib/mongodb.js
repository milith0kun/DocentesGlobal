import { MongoClient } from 'mongodb';

const MONGO_CLIENT_OPTIONS = {
  maxPoolSize: 20,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

export function hasMongoConfig() {
  return Boolean(process.env.MONGODB_URI);
}

export function clearMongoCache() {
  globalThis._mongoClient = null;
  globalThis._mongoClientPromise = null;
}

export async function getMongoDb() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'contrata_docentes';

  if (!uri) {
    throw new Error('Falta MONGODB_URI en variables de entorno');
  }

  // Si ya existe una promesa de conexión en el runtime global, validamos su salud
  if (globalThis._mongoClient && globalThis._mongoClientPromise) {
    try {
      const client = await globalThis._mongoClientPromise;
      const db = client.db(dbName);
      await db.command({ ping: 1 });
      return db;
    } catch (err) {
      console.warn('Conexión MongoDB inactiva, recreando cliente:', err.message);
      clearMongoCache();
    }
  }

  // Inicializar nuevo cliente con promesa global compartida
  try {
    const client = new MongoClient(uri, MONGO_CLIENT_OPTIONS);
    globalThis._mongoClient = client;
    globalThis._mongoClientPromise = client.connect();
    const connectedClient = await globalThis._mongoClientPromise;
    return connectedClient.db(dbName);
  } catch (error) {
    clearMongoCache();
    throw error;
  }
}

/**
 * Envoltorio para operaciones de MongoDB con reintento automático si la topología fue cerrada
 */
export async function withMongoRetry(operation) {
  try {
    const db = await getMongoDb();
    return await operation(db);
  } catch (error) {
    const isClosedError =
      error.message?.includes('Topology is closed') ||
      error.message?.includes('Client must be connected') ||
      error.name === 'MongoTopologyClosedError' ||
      error.name === 'MongoServerSelectionError';

    if (isClosedError) {
      console.warn('Conexión cerrada detectada. Reintentando con nueva conexión...');
      clearMongoCache();
      const freshDb = await getMongoDb();
      return await operation(freshDb);
    }
    throw error;
  }
}
