import express from 'express';
import { getSavings, createSavings, getSavingsSummary } from '../controllers/savingsController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getSavings);
router.get('/summary', getSavingsSummary);
router.post('/', requireAdmin, createSavings);

export default router;
