import redisClient from '../utils/redisClient.js';
import randomstring from 'randomstring';
import sendMail from '../services/sendMail.js';

export const sendOtpToEmail = async (user, headerMessage, templateFn, redis_key) => {
  const otp = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });

  await redisClient.set(redis_key, otp, {
    EX: parseInt(process.env.OTP_EXP),
  });

  await sendMail(
    user.email,
    headerMessage,
    templateFn(user.first_name, otp)
  );

  return otp; // Useful for tests
};

export const getSavedOtp = async (key) => {
  return await redisClient.get(key);
};

export const deleteOtp = async (key) => {
  return await redisClient.del(key);
};
