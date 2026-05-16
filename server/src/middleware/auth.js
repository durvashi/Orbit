import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verifies JWT and attaches the user to the request
export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Not authorized, user no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Not authorized, token failed or expired' });
  }
};

// Restricts a route to specific roles (e.g. authorize('admin'))
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This action requires one of these roles: ${roles.join(
          ', '
        )}`,
      });
    }
    next();
  };
};
