import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if the incoming request contains an Authorization Header with a Bearer Token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Isolate the token string away from the word "Bearer"
      token = req.headers.authorization.split(' ')[2] || req.headers.authorization.split(' ')[1];
      
      // Decode and verify the signature using our hidden JWT_SECRET key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Append the full authenticated user object onto the request lifecycle
      req.user = await User.findById(decoded.id).select('-password');
      
      return next(); // Pass control forward to the controller
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};