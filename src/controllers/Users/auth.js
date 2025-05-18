import prisma from "../../prisma/client.js";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken.js";
import redisClient from "../../utils/redisClient.js"; // Assuming you imported this
import { exclude } from "../../utils/exclude.js";
import { sendResponse } from "../../utils/responseHelper.js";

export const loginUser = async(req, res) => {
  try {
    const { email, password } = req.body;

    const user_exist = await prisma.user.findUnique({ where: { email } });

    if (!user_exist) {
      console.log(`[Login Failed] No user with email: ${email}`);
      return sendResponse(res, 404, false, "Invalid Credentials")
    }

    const is_match = await bcrypt.compare(password, user_exist.password);
    if (!is_match) {
      console.log(`[Login Failed] Password mismatch for user: ${email}`);
      return sendResponse(res, 400, false, "Invalid Credentials")
    }

    const token = generateToken(user_exist.id);
    const redis_key = `auth_token:${user_exist.id}`;

    await redisClient.set(redis_key, token, {
      EX: parseInt(process.env.EXP_TIME)
    });

    const user_obj = exclude(user_exist, ["password", "created_at", "updated_at"]);

    return sendResponse(res, 200, true, "logged in successfully", {...user_obj,token})

  } catch (error) {
  sendResponse(res, 500, false, error.message )
  }
};
