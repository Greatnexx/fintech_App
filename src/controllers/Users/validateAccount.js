import { sendResponse } from "../../utils/responseHelper.js";
import prisma from "../../prisma/client.js";
import redisClient from "../../utils/redisClient.js";
import randomstring from "randomstring";
import sendMail from "../../services/sendMail.js";
import { otpMessage } from "../../utils/message.js";

export const validateAccount = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user_exist = await prisma.user.findUnique({ where: { email } });
    if (!user_exist) {
      return sendResponse(res, 404, false, "User not found");
    }


    const otp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });

    // Store the OTP in Redis with an expiration time with the key format otp:<email>
    const redis_key = `otp:${email}`;
    await redisClient.set(redis_key, otp, {
      EX: parseInt(process.env.OTP_EXP),
    });

    await sendMail(
      user_exist.email,
      "Account Validation",
      otpMessage(user_exist.first_name, otp)
    );

    // we are adding the email to the response so that the client can use it to send the otp to the user
    return sendResponse(
      res,
      200,
      true,
      "OTP sent successfully",
      user_exist.email
    );
  } catch (error) {
    next(error);
  }
};
