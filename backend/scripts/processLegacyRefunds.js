import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

/**
 * Migration Script: Process Refunds for Legacy Cancelled Orders
 * 
 * This script finds all cancelled orders that:
 * - Were paid online (paymentMethod === 'Online')
 * - Have paymentStatus === 'paid'
 * - Have a razorpay_payment_id
 * - Don't have a refund status or have refundStatus === 'none'
 * 
 * And processes refunds for them via Razorpay API
 */

const processLegacyRefunds = async () => {
    try {
        console.log('🔄 Starting Legacy Refund Processing...\n');

        // Dynamically import models and utilities
        const { default: Order } = await import('../models/Order.js');
        const { default: getRazorpayInstance } = await import('../utils/razorpay.js');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all eligible orders
        const eligibleOrders = await Order.find({
            status: 'cancelled',
            paymentMethod: 'Online',
            paymentStatus: 'paid',
            'paymentDetails.razorpay_payment_id': { $exists: true, $ne: null },
            $or: [
                { refundStatus: { $exists: false } },
                { refundStatus: 'none' }
            ]
        });

        console.log(`📊 Found ${eligibleOrders.length} orders eligible for refund processing\n`);

        if (eligibleOrders.length === 0) {
            console.log('✨ No orders need refund processing. All done!');
            await mongoose.disconnect();
            return;
        }

        // Initialize Razorpay
        const rzp = getRazorpayInstance();
        if (!rzp) {
            console.error('❌ Razorpay not configured. Cannot process refunds.');
            await mongoose.disconnect();
            return;
        }

        let successCount = 0;
        let failedCount = 0;
        let skippedCount = 0;

        // Process each order
        for (const order of eligibleOrders) {
            const orderId = order._id.toString().slice(-8).toUpperCase();
            const paymentId = order.paymentDetails.razorpay_payment_id;

            console.log(`\n📦 Processing Order #${orderId}`);
            console.log(`   Payment ID: ${paymentId}`);
            console.log(`   Amount: ₹${order.totalAmount}`);

            try {
                // Initiate refund via Razorpay
                const refund = await rzp.payments.refund(paymentId, {
                    amount: order.totalAmount * 100, // Amount in paise
                    speed: 'normal',
                    notes: {
                        order_id: order._id.toString(),
                        reason: 'Legacy order refund - Automated migration'
                    }
                });

                console.log(`   ✅ Refund initiated successfully`);
                console.log(`   Refund ID: ${refund.id}`);

                // Update order with refund details
                order.paymentDetails.razorpay_refund_id = refund.id;
                order.refundStatus = 'processed';
                await order.save();

                successCount++;

            } catch (error) {
                console.error(`   ❌ Refund failed: ${error.message}`);

                // Check if it's already refunded
                if (error.error && error.error.description &&
                    error.error.description.includes('already been refunded')) {
                    console.log(`   ℹ️  Payment already refunded - Marking as processed`);
                    order.refundStatus = 'processed';
                    await order.save();
                    skippedCount++;
                } else {
                    // Mark as failed
                    order.refundStatus = 'failed';
                    await order.save();
                    failedCount++;
                }
            }

            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 REFUND PROCESSING SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total Orders Processed: ${eligibleOrders.length}`);
        console.log(`✅ Successfully Refunded: ${successCount}`);
        console.log(`⏭️  Already Refunded (Skipped): ${skippedCount}`);
        console.log(`❌ Failed: ${failedCount}`);
        console.log('='.repeat(60) + '\n');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        console.log('🎉 Migration complete!\n');

    } catch (error) {
        console.error('❌ Migration Error:', error);
        try {
            await mongoose.disconnect();
        } catch (e) {
            // Ignore disconnect errors
        }
        process.exit(1);
    }
};

// Run the migration
processLegacyRefunds();
