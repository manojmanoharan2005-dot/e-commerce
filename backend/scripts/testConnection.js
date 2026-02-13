import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

console.log('Testing MongoDB connection...');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI value:', process.env.MONGO_URI ? 'Set (hidden)' : 'NOT SET');

if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set in .env file');
    process.exit(1);
}

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Successfully connected to MongoDB');
    await mongoose.disconnect();
    console.log('✅ Successfully disconnected');
} catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
}
