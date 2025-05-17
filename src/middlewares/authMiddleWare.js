import jwt from 'jsonwebtoken';

import { redisClient } from '../utils/redisClient.js';

const protect = (async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id
            // ✅ Check Redis tokenoded._id;

            const redisToken = await redisClient.get(`auth_token:${userId}`);
            if (!redisToken || redisToken !== token) {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid or expired token',
                    data: null,
                });
            }
            // ✅ Refresh Redis token expiration
            // sliding expiration
            await redisClient.expire(`auth_token:${userId}`, parseInt(process.env.EXP_TIME));

            console.log('Redis token:', redisToken ? 'Found' : 'Not Found');
            console.log('JWT Decoded Exp:', new Date(decoded.exp * 1000));
            console.log('Current Time:', new Date());


            // Attach user to req object
            req.user = await User.findById(userId).select('-password');

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
});





export {protect};