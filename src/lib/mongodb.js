import { MongoClient } from 'mongodb';

const MONGO_CLIENT_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

let cachedClient = null;
let cachedDb = null;

function isClientAlive(client) {
  if (!client) return false;
  try {
    const topology = client.topology;
    if (!topology) return false;
    if (typeof topology.isDestroyed === 'function' && topology.isDestroyed()) return false;
    if (typeof topology.isConnected === 'function' && !topology.isConnected()) return false;
    if (topology.s?.state === 'closed' || topology.s?.state === 'destroying') return false;
    return true;
  } catch {
    return false;
  }
}

export function hasMongoConfig() {
  return Boolean(process.env.MONGODB_URI);
}

export function clearMongoCache() {
  if (cachedClient) {
    try {
      cachedClient.close().catch(() => {});
    } catch {
      // Ignorar fallos al cerrar
    }
  }
  cachedClient = null;
  cachedDb = null;
}

export async function getMongoDb() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'contrata_docentes';

  if (!uri) {
    throw new Error('Falta MONGODB_URI en variables de entorno');
  }

  // Si el cliente en caché sigue vivo y conectado, retornamos la DB en caché
  if (cachedClient && cachedDb && isClientAlive(cachedClient)) {
    return cachedDb;
  }

  // Si estaba cerrado o nulo, limpiamos la referencia
  clearMongoCache();

  try {
    cachedClient = new MongoClient(uri, MONGO_CLIENT_OPTIONS);
    await cachedClient.connect();
    cachedDb = cachedClient.db(dbName);
    return cachedDb;
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
      console.warn('Conexión MongoDB cerrada detectada. Reconectando y reintentando operación...');
      clearMongoCache();
      const freshDb = await getMongoDb();
      return await operation(freshDb);
    }
    throw error;
  }
}

