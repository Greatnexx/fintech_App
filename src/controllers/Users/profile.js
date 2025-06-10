import  prisma  from '../../prisma/client.js';
import { sendResponse } from '../../utils/responseHelper.js';

export const createUserProfile = async(req, res,next) => {
  try {
    const user_id = req.user.id;

    const {
      address,
      profile_image,
      city,
      date_of_birth,
      lga,
      state,
      country,
      zip_code,
      marital_status,
    } = req.body;

    const existingProfile = await prisma.userProfile.findUnique({
      where: { user_id: user_id },
    });

    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists.' });
    }

    const newProfile = await prisma.userProfile.create({
      data: {
        address,
        profile_image,
        city,
        date_of_birth: new Date(date_of_birth),
        lga,
        state,
        country,
        zip_code,
        marital_status,
        user: {
          connect: { id: user_id },
        },
      },
    });

    // You're telling Prisma: "Find the user in the database whose id matches the ID of the currently logged-in user."
    // In Prisma, connect is used to link an existing record (in another table/model) via a relation.
    // The connect keyword is telling Prisma:

    // “Hey, I’m not creating a new user. I want to link this profile to an already existing user whose ID is user_id.”
    // So Prisma will find the user with that id in the User table and associate this profile with them.

    return sendResponse(res, 201, true, 'Profile created successfully', newProfile);
  } catch (error) {
    next(error);

  }
};


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
