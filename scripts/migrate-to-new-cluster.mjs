import { MongoClient } from 'mongodb';

const SOURCE_URI = 'mongodb://174449_db_user:1997281qA@ac-joqursp-shard-00-00.feeeugl.mongodb.net:27017,ac-joqursp-shard-00-01.feeeugl.mongodb.net:27017,ac-joqursp-shard-00-02.feeeugl.mongodb.net:27017/?ssl=true&replicaSet=atlas-p47xno-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';
const TARGET_URI = 'mongodb://grupocgblatam_db_user:jampier1997281qA@ac-hch6tnu-shard-00-00.losigdp.mongodb.net:27017,ac-hch6tnu-shard-00-01.losigdp.mongodb.net:27017,ac-hch6tnu-shard-00-02.losigdp.mongodb.net:27017/?ssl=true&replicaSet=atlas-9ttg3j-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'contrata_docentes';

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
