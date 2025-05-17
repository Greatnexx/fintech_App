import prisma from "../../prisma/client.js";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken.js";
import redisClient from "../../utils/redisClient.js"; // Assuming you imported this
import { exclude } from "../../utils/exclude.js";

export const loginUser = async(req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await prisma.user.findUnique({ where: { email } });

    if (!userExist) {
      console.log(`[Login Failed] No user with email: ${email}`);
      return res.status(404).json({
        status: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      console.log(`[Login Failed] Password mismatch for user: ${email}`);
      return res.status(401).json({
        status: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    const token = generateToken(userExist.id);
    const redisKey = `auth_token:${userExist.id}`;

    await redisClient.set(redisKey, token, {
      EX: parseInt(process.env.EXP_TIME)
    });

    const userObj = exclude(userExist, ["password", "created_at", "updated_at"]);

    return res.status(200).json({
      status: true,
      data:{
          ...userObj,
          token,
        },
        message: "logged in successfully",
    });

  } catch (error) {
    console.error("[Login Error]", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
