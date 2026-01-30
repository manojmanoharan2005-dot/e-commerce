import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail } from '../services/mailService.js';

// Initialize Razorpay lazily to ensure environment variables are loaded
let razorpay;
const getRazorpayInstance = () => {
    if (!razorpay) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('❌ Razorpay Error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in .env');
            return null;
        }
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
    return razorpay;
};

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payments/create-order
 * @access  Private
 */
export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: 'Amount is required'
            });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1
        };

        const rzp = getRazorpayInstance();
        if (!rzp) {
            throw new Error('Razorpay is not correctly configured');
        }

        const response = await rzp.orders.create(options);

        res.status(200).json({
            success: true,
            data: {
                id: response.id,
                currency: response.currency,
                amount: response.amount,
                key_id: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating Razorpay order',
            error: error.message
        });
    }
};

/**
 * @desc    Verify Razorpay Payment Signature
 * @route   POST /api/payments/verify
 * @access  Private
 */
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData // Internal order data to save after verification
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // 1. Double check and Deduct Stock, and populate full item details
            const finalItems = [];
            for (const item of orderData.items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }

                // Deduct stock
                product.stock -= item.quantity;
                await product.save();

                // Add to final items list with subtotal and name
                finalItems.push({
                    productId: product._id,
                    name: product.name,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity
                });
            }

            // 2. Create the actual order in our database
            const newOrder = new Order({
                ...orderData,
                items: finalItems,
                userId: req.user._id,
                paymentStatus: 'paid',
                paymentDetails: {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature
                },
                status: 'confirmed'
            });

            await newOrder.save();

            // Send order confirmation email (non-blocking)
            sendOrderConfirmationEmail(req.user, newOrder);

            return res.status(200).json({
                success: true,
                message: "Payment verified and order placed successfully",
                order: newOrder
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid signature sent!"
            });
        }
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment",
            error: error.message
        });
    }
};
