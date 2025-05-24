import bcrypt from 'bcryptjs'
import prisma from "../../prisma/client.js"
import generateToken from '../../utils/generateToken.js';
import { exclude } from '../../utils/exclude.js';
import { sendResponse } from '../../utils/responseHelper.js';

export const createUser = async(req, res) => {
  try {
    const { email, first_name, last_name, password, phone_number } = req.body;

    // Check if user already exists by email or username
    const user_exist = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone_number }
        ]
      }
    });

    if (user_exist) {
       return sendResponse(res, 400, false, "User Already Exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        password: hashedPassword,
        phone_number,
        
        
      }
    });

    if (!user) {
      return sendResponse(res,500,false,"Failed to register user")
      
    }

    
    // This query fetches the role with the name 'regular_user' from the database.
    // If the role does not exist, it returns an error response.
    // The role is then assigned to the newly created user.
   

    const role = await prisma.roles.findUnique({
      where: { name: 'regular_user' },
    });

    if (!role) {
      return sendResponse(res, 500, false, " role not found");
    }

    // This query creates a new entry in the userRoles table, linking the user with the 'regular_user' role.
    // This is done to establish a many-to-many relationship between users and roles.

    await prisma.userRoles.create({
      data: {
        user_id: user.id,
        role_id: role.id,
      },
    });

    // attach the role name to the user object
   

    const user_obj = exclude(user, ["password"]);


    // Generate auth token
    const token = generateToken(user.id);


    return sendResponse(res, 201, true, "User registered successfully", { ...user_obj,token });
  } catch (error) {
    sendResponse(res,500,false,error.message)
  }
};
