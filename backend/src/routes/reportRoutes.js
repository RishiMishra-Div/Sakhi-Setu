import express from 'express';
import { getDashboardStats, getMonthlyReport } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/monthly', getMonthlyReport);

export default router;
