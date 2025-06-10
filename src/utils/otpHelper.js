// utils/otpHelper.js
import redisClient from "../utils/redisClient.js";
import randomstring from "randomstring";
import sendMail from "../services/sendMail.js";
import { otpMessage } from "./message.js";

export const sendOtpToEmail = async (user) => {
  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });

  const redis_key = `otp:${user.email}`;
  await redisClient.set(redis_key, otp, {
    EX: parseInt(process.env.OTP_EXP),
  });

  await sendMail(
    user.email,
    "Account Validation",
    otpMessage(user.first_name, otp)
  );
  return otp;
};

// we return the otp so that we can use it in the controller to verify the otp for testing purposes