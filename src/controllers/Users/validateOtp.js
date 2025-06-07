import prisma from '../../prisma/client.js';
import redisClient from '../../utils/redisClient.js';
import { sendResponse } from '../../utils/responseHelper.js';

export const verifyOtp = async (req, res, next) => {
  try {
    // Extract email and OTP from request body we are including email instead of only otp because we need to check if the user exists in the database
    
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    })
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }


    const redis_key = `otp:${email}`;
    const savedOtp = await redisClient.get(redis_key);

    if (!savedOtp) {
      return sendResponse(res, 400, false, "OTP expired or not found");
    }

    if (savedOtp !== otp) {
      return sendResponse(res, 400, false, "Invalid OTP");
    }

    //  delete the OTP once it is verified ensuring it can't be used again
    await redisClient.del(redis_key);

    return sendResponse(res, 200, true, "OTP verified successfully");

  } catch (error) {
    next(error);
  }
};
