import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Member } from '../models/Member.js';
import { Group } from '../models/Group.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'sakhi_setu_super_secure_jwt_secret_key_2026', {
    expiresIn: '30d'
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.active) {
      return res.status(403).json({ message: 'This account has been deactivated. Please contact the leader.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        memberId: user.memberId,
        groupId: user.groupId,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

export const updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    if (!['mr', 'hi', 'en'].includes(language)) {
      return res.status(400).json({ message: 'Invalid language selection' });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { preferredLanguage: language }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update language', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
};
