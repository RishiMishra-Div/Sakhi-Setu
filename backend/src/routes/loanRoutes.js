import express from 'express';
import { getLoans, getLoanById, createLoan, recordRepayment } from '../controllers/loanController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getLoans);
router.get('/:id', getLoanById);
router.post('/', requireAdmin, createLoan);
router.post('/:id/repayments', requireAdmin, recordRepayment);

export default router;
