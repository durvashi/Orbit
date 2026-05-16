import User from '../models/User.js';

// @desc    List all users (for assigning tasks / adding members)
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('name email role avatarColor')
      .sort({ name: 1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
