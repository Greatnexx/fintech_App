import prisma from '../../prisma/client.js';
import { sendResponse } from '../../utils/responseHelper.js';

export const getUserProfile = async(req, res,next) => {
  try {
    const user_id = req.user.id;

    // Fetch the user profile from the database
    const profile = await prisma.user.findUnique({
      where: { id: user_id },
      include:{
        profile: true,
      },
    });

    if (!profile) {
      return sendResponse(res, 404, false, 'Profile not found');
    }

    return sendResponse(res, 200, true, 'Profile retrieved successfully', profile);
  } catch (error) {
    next(error);

  }
};

// include profile:true note we are not using the name of the model here but the name of the relation which is the field in the user model that links to the profile.
// The connect is when you want to link a new record to an existing one while use include when you want to fetch the data from the related table.
// if you are creating and updating use connect but if you are fetching use include.
