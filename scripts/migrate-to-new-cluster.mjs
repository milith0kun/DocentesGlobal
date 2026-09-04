import nextEnv from '@next/env';
import { MongoClient } from 'mongodb';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const SOURCE_URI = process.env.SOURCE_MONGODB_URI;
const TARGET_URI = process.env.TARGET_MONGODB_URI || process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'contrata_docentes';

async function migrate() {
  console.log('Connecting to SOURCE MongoDB...');
  const sourceClient = new MongoClient(SOURCE_URI);
  await sourceClient.connect();
  console.log('Connected to SOURCE.');

  console.log('Connecting to TARGET MongoDB...');
  const targetClient = new MongoClient(TARGET_URI);
  await targetClient.connect();
  console.log('Connected to TARGET.');

  const sourceDb = sourceClient.db(DB_NAME);
  const targetDb = targetClient.db(DB_NAME);

  const collections = await sourceDb.listCollections().toArray();
  console.log(`Found ${collections.length} collection(s) in source database "${DB_NAME}":`);

  for (const colInfo of collections) {
    const colName = colInfo.name;
    if (colName.startsWith('system.')) continue;

    console.log(`\n--- Processing collection: ${colName} ---`);
    const sourceCol = sourceDb.collection(colName);
    const targetCol = targetDb.collection(colName);

    const count = await sourceCol.countDocuments();
    console.log(`Source count: ${count} documents`);

    if (count > 0) {
      const docs = await sourceCol.find({}).toArray();
      // Insert in chunks of 500 or insertMany directly
      console.log(`Copying ${docs.length} documents to target...`);
      
      // Use replaceOne with upsert or bulkWrite so it's idempotent
      const operations = docs.map((doc) => ({
        replaceOne: {
          filter: { _id: doc._id },
          replacement: doc,
          upsert: true,
        },
      }));

      const res = await targetCol.bulkWrite(operations);
      console.log(`Bulk write result: ${res.upsertedCount} inserted, ${res.modifiedCount} modified, ${res.matchedCount} matched.`);
    }

    // Copy indexes (except default _id_)
    const indexes = await sourceCol.indexes();
    for (const index of indexes) {
      if (index.name === '_id_') continue;
      console.log(`Creating index: ${index.name} with keys:`, index.key);
      const options = { ...index };
      delete options.key;
      delete options.v;
      delete options.ns;
      try {
        await targetCol.createIndex(index.key, options);
      } catch (idxErr) {
        console.warn(`Warning creating index ${index.name}:`, idxErr.message);
      }
    }

    const targetCount = await targetCol.countDocuments();
    console.log(`Target count for ${colName}: ${targetCount} documents.`);
  }

  console.log('\nMigration complete successfully!');
  await sourceClient.close();
  await targetClient.close();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
