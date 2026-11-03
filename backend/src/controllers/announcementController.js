import { Announcement } from '../models/Announcement.js';

export const getAnnouncements = async (req, res) => {
  try {
    const { status = 'active' } = req.query;
    let query = {};
    if (status !== 'all') {
      query.status = status;
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .sort({ priority: -1, postedDate: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch announcements', error: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, body, category, priority, expiryDate } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const announcement = new Announcement({
      title,
      body,
      category: category || 'General / सामान्य',
      priority: priority || 'normal',
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      createdBy: req.user._id,
      status: 'active'
    });

    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create announcement', error: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update announcement', error: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete announcement', error: error.message });
  }
};
