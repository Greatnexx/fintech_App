import prisma from "../../prisma/client.js";
import { sendResponse } from "../../utils/responseHelper.js";

export const getUserProfile = async (req, res,next) => {
  try {
    const user_id = req.user.id;

    // Fetch the user profile from the database
    const profile = await prisma.user.findUnique({
      where: { id: user_id },
      include:{
        profile: true,
      }
    });

    if (!profile) {
      return sendResponse(res, 404, false, "Profile not found");
    }

    return sendResponse(res, 200, true, "Profile retrieved successfully", profile);
  } catch (error) {
   next(error);
 
  }
}