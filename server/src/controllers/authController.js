import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981',
  '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6',
];

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide name, email and password' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res
        .status(400)
        .json({ message: 'An account with that email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      // Only allow admin role when explicitly chosen at signup
      role: role === 'admin' ? 'admin' : 'member',
      avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarColor: user.avatarColor,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user and return token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarColor: user.avatarColor,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the currently logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatarColor: req.user.avatarColor,
    });
  } catch (error) {
    next(error);
  }
};
