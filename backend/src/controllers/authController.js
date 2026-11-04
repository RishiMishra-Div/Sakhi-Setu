import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Member } from '../models/Member.js';
import { Group } from '../models/Group.js';
import { getJwtSecret } from '../config/jwt.js';
import { randomBytes } from 'node:crypto';

const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (name.length > 100 || email.length > 254 || phone.length > 30 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Enter a valid name, email address, and phone number.' });
    }

    if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and no more than 72 bytes.' });
    }

    const jwtSecret = getJwtSecret();

    if (await User.exists({ email })) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    let group = await Group.findOne();
    if (!group) {
      group = await Group.create({});
    }

    const member = await Member.create({
      groupId: group._id,
      memberCode: `MBG-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`,
      name,
      phone,
      roleInGroup: 'सदस्य (Member)',
      status: 'active'
    });

    let user;
    try {
      [user] = await User.create([{
        name,
        email,
        password,
        role: 'member',
        memberId: member._id,
        groupId: group._id,
        phone,
        active: true
      }]);
    } catch (error) {
      await Member.deleteOne({ _id: member._id });
      if (error.code === 11000) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }
      throw error;
    }

    res.status(201).json({
      token: jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '30d' }),
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
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Unable to create account right now.' });
  }
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
