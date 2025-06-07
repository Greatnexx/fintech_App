import bcrypt from "bcryptjs";
import prisma from "../../prisma/client.js";
import { sendResponse } from "../../utils/responseHelper.js";

export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return sendResponse(res, 200, true, "Password reset successfully");
  } catch (error) {
    next(error);
  }
};
