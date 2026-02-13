import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { sendRefundConfirmationEmail } from './services/refundMailService.js';

dotenv.config();

const testRefundEmail = async () => {
    try {
        console.log('📧 Testing Refund Confirmation Email...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Import models
        const { default: Order } = await import('./models/Order.js');
        const { default: User } = await import('./models/User.js');

        // Find a cancelled order with refund
        const order = await Order.findOne({
            status: 'cancelled',
            paymentMethod: 'Online',
            refundStatus: 'processed'
        });

        if (!order) {
            console.log('❌ No cancelled order with refund found');
            await mongoose.disconnect();
            return;
        }

        // Get the user
        const user = await User.findById(order.userId);

        if (!user) {
            console.log('❌ User not found');
            await mongoose.disconnect();
            return;
        }

        console.log(`📦 Order ID: ${order._id.toString().slice(-8).toUpperCase()}`);
        console.log(`👤 User: ${user.name} (${user.email})`);
        console.log(`💰 Refund Amount: ₹${order.totalAmount}`);
        console.log(`🆔 Refund ID: ${order.paymentDetails?.razorpay_refund_id || 'N/A'}\n`);

        // Send the email
        await sendRefundConfirmationEmail(user, order);

        console.log('\n✅ Test email sent successfully!');
        console.log(`📬 Check inbox: ${user.email}\n`);

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Test Error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

testRefundEmail();
