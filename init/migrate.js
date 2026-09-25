require("dotenv").config();

const mongoose = require("mongoose");

const localUrl = process.env.LOCAL_DB_URL || "mongodb://127.0.0.1:27017/wounderlist";
const atlasUrl = process.env.ATLAS_DB_URL;

if (!atlasUrl) {
  throw new Error("ATLAS_DB_URL is not configured in .env");
}

const copyDatabase = async () => {
  const source = await mongoose.createConnection(localUrl).asPromise();
  const target = await mongoose.createConnection(atlasUrl).asPromise();

  try {
    const collections = await source.db.listCollections().toArray();

    for (const collectionInfo of collections) {
      const sourceCollection = source.db.collection(collectionInfo.name);
      const targetCollection = target.db.collection(collectionInfo.name);
      const documents = await sourceCollection.find({}).toArray();

      await targetCollection.deleteMany({});
      if (documents.length > 0) {
        await targetCollection.insertMany(documents, { ordered: false });
      }

      console.log(`${collectionInfo.name}: copied ${documents.length} document(s)`);
    }
  } finally {
    await source.close();
    await target.close();
  }
};

copyDatabase()
  .then(() => console.log("Local database copied to MongoDB Atlas."))
  .catch((error) => {
    console.error("Database migration failed:", error.message);
    process.exitCode = 1;
  });