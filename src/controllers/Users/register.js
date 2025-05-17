import bcrypt from 'bcryptjs'
import prisma from "../../prisma/client.js"
import generateToken from '../../utils/generateToken.js';
import { exclude } from '../../utils/exclude.js';

export const createUser = async (req, res) => {
  try {
    const {  email, first_name, last_name, password, phone_number, address, date_of_birth } = req.body;

    // Check if user already exists by email or username
    const userExist = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone_number }
        ]
      }
    });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User Already Exists",
        data: null
      });
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
      return res.status(500).json({
        status: false,
        message: 'Failed to register user',
        data: null
      });
    }

    // Generate auth token
    const token = generateToken(user.id);

    const userObj = exclude(user, ["password"]);

    return res.status(201).json({
      status: true,
       data: {
        ...userObj,
        token,
      
    },
    
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
