import  prisma  from "../../prisma/client.js";
import { sendResponse } from "../../utils/responseHelper.js";


export const createUserProfile = async (req, res) => {
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
      where: { user_id: user_id }
    });

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists." });
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
      

    return sendResponse(res, 201, true, "Profile created successfully", newProfile);
  } catch (error) {
  return  sendResponse(res, 500, false, error.message);
   
  }
};
