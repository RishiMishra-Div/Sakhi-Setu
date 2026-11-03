import express from 'express';
import { getMembers, getMemberById, createMember, updateMember, toggleMemberStatus } from '../controllers/memberController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All member routes require logged-in user

router.get('/', getMembers);
router.get('/:id', getMemberById);
router.post('/', requireAdmin, createMember);
router.patch('/:id', requireAdmin, updateMember);
router.patch('/:id/toggle-status', requireAdmin, toggleMemberStatus);

export default router;
