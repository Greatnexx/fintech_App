import jwt from 'jsonwebtoken';
import  redisClient  from '../utils/redisClient.js';
import prisma from '../prisma/client.js';

const protect = async(req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      //  Check Redis token
      const redisToken = await redisClient.get(`auth_token:${userId}`);
      if (!redisToken || redisToken !== token) {
        return res.status(401).json({
          status: false,
          message: 'Invalid or expired token',
          data: null,
        });
      }

      //  Refresh token expiration (sliding expiration)
      await redisClient.expire(
        `auth_token:${userId}`,
        parseInt(process.env.EXP_TIME),
      );

      //  fetch the user andd role from the dB

      const userWithRole = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!userWithRole) {
        return res.status(404).json({
          status: false,
          message: 'User not found',
          data: null,
        });
      }

      // Attach user + role to req
      const roleName = userWithRole.roles[0]?.role?.name;
      req.user = {
        ...userWithRole,
        role: roleName,
      };

      return next();

    } catch (error) {
      // eslint-disable-next-line
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

const isAdmin = async(req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({
      status: false,
      message: 'Not authorized as an admin',
      data: null,
    });
  }
};

const isStaff = async(req, res, next) => {
  if (req.user && req.user.role === 'staff') {
    return next();
  } else {
    return res.status(403).json({
      status: false,
      message: 'Not authorized as staff',
      data: null,
    });
  }
};

const isRegularUser = async(req, res, next) => {
  if (req.user && req.user.role === 'regular_user') {
    return next();
  } else {
    return res.status(403).json({
      status: false,
      message: 'Not authorized as a regular user',
      data: null,
    });
  }
};

export { protect, isAdmin, isRegularUser, isStaff };
