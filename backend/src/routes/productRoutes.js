import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, sendProductInquiry } from '../controllers/productController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/inquiry', sendProductInquiry);

// Admin-only routes
router.post('/', protect, requireAdmin, createProduct);
router.patch('/:id', protect, requireAdmin, updateProduct);
router.delete('/:id', protect, requireAdmin, deleteProduct);

export default router;
