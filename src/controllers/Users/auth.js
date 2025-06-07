import prisma from '../../prisma/client.js';
import bcrypt from 'bcryptjs';
import generateToken from '../../utils/generateToken.js';
import redisClient from '../../utils/redisClient.js'; // Assuming you imported this
import { exclude } from '../../utils/exclude.js';
import { sendResponse } from '../../utils/responseHelper.js';


export const loginUser = async(req, res,next) => {
  try {
    const { email, password } = req.body;

    // "Hey database, find this user by their email, and while you're at it, also show me all their roles, and inside each role, show me the role details so if they have two roles it will show array of roles for admin and the details and then for customer and the details."

    const user_exist = await prisma.user.findUnique({ where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user_exist) {
      return sendResponse(res, 404, false, 'Invalid Credentials');
    }

    const is_match = await bcrypt.compare(password, user_exist.password);
    if (!is_match) {
      return sendResponse(res, 400, false, 'Invalid Credentials');
    }

    const token = generateToken(user_exist.id);
    const redis_key = `auth_token:${user_exist.id}`;

    await redisClient.set(redis_key, token, {
      EX: parseInt(process.env.EXP_TIME),
    });

    const user_obj = exclude(user_exist, ['password','roles', 'created_at', 'updated_at']);
    const roleName = user_exist.roles[0]?.role?.name;
    // if the user has multiple roles, you can handle that logic here as needed like this
    // const roleNames = user_exist.roles.map(role => role.role.name).join(', '); we use join to convert the array of role names into a string
    // Without join you will get ["Admin", "Customer"]
    // with join you will get "Admin, Customer"



    return sendResponse(res, 200, true, 'logged in successfully', { ...user_obj,role:{ roleName },token });

  } catch (error) {
    next(error);
  }
};

