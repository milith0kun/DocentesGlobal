import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'contrata_docentes';

let cachedClient = null;
let cachedDb = null;

export function hasMongoConfig() {
  return Boolean(MONGODB_URI);
}

export async function getMongoDb() {
  if (!MONGODB_URI) {
    throw new Error('Falta MONGODB_URI en variables de entorno');
  }

  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI);
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(MONGODB_DB_NAME);
  return cachedDb;
}

