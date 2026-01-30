import express from 'express';
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// DEBUG ENDPOINT - Check email configuration (Remove after debugging)
router.get('/debug-email-config', (req, res) => {
    const config = {
        MAIL_HOST: process.env.MAIL_HOST || 'NOT SET',
        MAIL_PORT: process.env.MAIL_PORT || 'NOT SET',
        MAIL_USER: process.env.MAIL_USER || 'NOT SET',
        MAIL_PASS: process.env.MAIL_PASS ? '***SET***' : 'NOT SET',
        MAIL_FROM: process.env.MAIL_FROM || 'NOT SET',
        MAIL_SERVICE: process.env.MAIL_SERVICE || 'NOT SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    };

    res.json({
        success: true,
        message: 'Email configuration check',
        config: config,
        allMailEnvVars: Object.keys(process.env).filter(key => key.startsWith('MAIL_'))
    });
});


// Protected routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.patch('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
