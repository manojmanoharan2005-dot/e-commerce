import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const adminEmail = 'storemanager@gmail.com';
    const adminPassword = 'Admin@12345';
    const adminPhone = '9876543210';

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      user.password = adminPassword;
      user.role = 'admin';
      user.isBlocked = false;
      user.isEmailVerified = true;
      if (!user.phone) user.phone = adminPhone;
      await user.save();
      console.log(`Updated existing user ${adminEmail} to admin with password: ${adminPassword}`);
    } else {
      user = await User.create({
        name: 'Store Manager',
        username: 'storemanager',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: adminPhone,
        isEmailVerified: true
      });
      console.log(`Created new admin user: ${adminEmail} with password: ${adminPassword}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
