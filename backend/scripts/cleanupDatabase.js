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

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      if (!KEEP_COLLECTIONS.includes(collection.name)) {
        console.log(`Dropping collection: ${collection.name}...`);
        await mongoose.connection.db.dropCollection(collection.name);
        console.log(`Successfully dropped ${collection.name}.`);
      } else {
        console.log(`Keeping collection: ${collection.name}`);
      }
    }

    console.log('Database cleanup completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during database cleanup:', error);
    process.exit(1);
  }
}

cleanup();