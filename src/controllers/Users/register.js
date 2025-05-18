import bcrypt from 'bcryptjs'
import prisma from "../../prisma/client.js"
import generateToken from '../../utils/generateToken.js';
import { exclude } from '../../utils/exclude.js';
import { sendResponse } from '../../utils/responseHelper.js';

export const createUser = async(req, res) => {
  try {
    const {  email, first_name, last_name, password, phone_number, address, date_of_birth } = req.body;

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
        date_of_birth,
        address
      }
    });

    if (!user) {
      return sendResponse(res,500,false,"Failed to register user")
      
    }

    // Generate auth token
    const token = generateToken(user.id);

    const user_obj = exclude(user, ["password"]);

    return sendResponse(res, 201, true, "User registered successfully", { ...user_obj,token });
  } catch (error) {
    sendResponse(res,500,false,error.message)
  }
};
