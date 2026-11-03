import express from 'express';
import { getGroup, updateGroup } from '../controllers/groupController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getGroup);
router.put('/', protect, requireAdmin, updateGroup);

export default router;
