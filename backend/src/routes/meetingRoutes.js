import express from 'express';
import { getMeetings, getMeetingById, createMeeting, updateMeeting, saveMeetingAttendance } from '../controllers/meetingController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getMeetings);
router.get('/:id', getMeetingById);
router.post('/', requireAdmin, createMeeting);
router.patch('/:id', requireAdmin, updateMeeting);
router.put('/:id/attendance', requireAdmin, saveMeetingAttendance);

export default router;
