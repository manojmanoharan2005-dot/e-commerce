import express from 'express';
import {
    getProducts,
    smartSearch,
    getProduct,
    getAIAdvice,
    getPriceAnalysis,
    createProduct,
    updateProduct,
    deleteProduct,
    getAIPriceSuggestions,
    applyAIPriceSuggestions
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/search', smartSearch);

// Admin AI routes (Must be before :id routes)
router.get('/admin/ai-price-suggestions', protect, adminOnly, getAIPriceSuggestions);
router.post('/admin/apply-prices', protect, adminOnly, applyAIPriceSuggestions);

// Public dynamic routes
router.get('/:id', getProduct);
router.post('/:id/advice', getAIAdvice);
router.get('/:id/price-intelligence', getPriceAnalysis);

// Admin CRUD routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
