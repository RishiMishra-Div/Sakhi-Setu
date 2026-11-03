import express from 'express';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Allow reading announcements for authenticated users and public
router.get('/', getAnnouncements);

// Admin-only management
router.post('/', protect, requireAdmin, createAnnouncement);
router.patch('/:id', protect, requireAdmin, updateAnnouncement);
router.delete('/:id', protect, requireAdmin, deleteAnnouncement);

export default router;
