import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const KEEP_COLLECTIONS = [
  'users',
  'products',
  'orders',
  'payments',
  'addresses',
  'invoices',
  'notifications',
  'quotes',
  'containers'
];

async function cleanupAll() {
  try {
    console.log('Connecting to MongoDB...');
    // Connect without a specific db to use the admin command
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    
    // Get list of all databases
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.listDatabases();
    
    for (const dbInfo of result.databases) {
      if (dbInfo.name === 'admin' || dbInfo.name === 'local' || dbInfo.name === 'config') continue;
      
      console.log(`\n--- Inspecting Database: ${dbInfo.name} ---`);
      
      // Switch to this DB
      const currentDb = mongoose.connection.useDb(dbInfo.name).db;
      const collections = await currentDb.listCollections().toArray();
      
      for (const collection of collections) {
        if (!KEEP_COLLECTIONS.includes(collection.name)) {
          console.log(`[${dbInfo.name}] Dropping collection: ${collection.name}`);
          try {
            await currentDb.dropCollection(collection.name);
          } catch(e) {
            console.log(`Failed to drop ${collection.name}: ${e.message}`);
          }
        } else {
          console.log(`[${dbInfo.name}] Keeping collection: ${collection.name}`);
        }
      }
    }

    console.log('\nDatabase cleanup completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during database cleanup:', error);
    process.exit(1);
  }
}

cleanupAll();