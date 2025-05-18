import jwt from 'jsonwebtoken';
import { redisClient } from '../utils/redisClient.js';
import prisma from '../prisma/client.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // ✅ Check Redis token
      const redisToken = await redisClient.get(`auth_token:${userId}`);
      if (!redisToken || redisToken !== token) {
        return res.status(401).json({
          status: false,
          message: 'Invalid or expired token',
          data: null,
        });
      }

      // ✅ Refresh token expiration (sliding expiration)
      await redisClient.expire(
        `auth_token:${userId}`,
        parseInt(process.env.EXP_TIME)
      );

      // ✅ Attach user to request
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User not found',
          data: null,
        });
      }

      req.user = user; 
      
      return next();

    } catch (error) {
      console.error(error);
      return res.status(401).json({
        status: false,
        message: 'Not authorized, token failed',
        data: null,
      });
    }
  }

  return res.status(401).json({
    status: false,
    message: 'Not authorized, no token',
    data: null,
  });
};

export { protect };
