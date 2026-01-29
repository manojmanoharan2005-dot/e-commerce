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

// Protected routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.patch('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
