import prisma from '../../prisma/client.js';
import bcrypt from 'bcryptjs';
import generateToken from '../../utils/generateToken.js';
import redisClient from '../../utils/redisClient.js'; // Assuming you imported this
import { exclude } from '../../utils/exclude.js';
import { sendResponse } from '../../utils/responseHelper.js';
import sendMail from '../../services/sendMail.js';
import {
  confirmRegistrationMessage,
  loginMessage,
  otpMessage,
  registerMessage,
  validateAccountMessage,
} from '../../utils/message.js';
import {
  deleteOtp,
  getSavedOtp,
  sendOtpToEmail,
} from '../../utils/otpHelper.js';
import { generateAccountNumber } from '../../utils/generateAccountNumber.js';

export const createUser = async(req, res, next) => {
  try {
    const { email, first_name, last_name, password, phone_number } = req.body;

    // Check if user already exists by email or username
    const user_exist = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone_number }],
      },
    });

    if (user_exist) {
      return sendResponse(res, 400, false, 'User Already Exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database and assign them a status Prisma allows you to connect a relation by any unique field, not just id.and name is the unique field thats why we use name to connect
    const user = await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        password: hashedPassword,
        phone_number,
      },
    });

    if (!user) {
      return sendResponse(res, 500, false, 'Failed to register user');
    }

    // This query fetches the role with the name 'regular_user' from the database.
    // If the role does not exist, it returns an error response.
    // The role is then assigned to the newly created user.

    const role = await prisma.roles.findUnique({
      where: { name: 'regular_user' },
    });

    if (!role) {
      return sendResponse(res, 500, false, ' role not found');
    }

    // This query creates a new entry in the userRoles table, linking the user with the 'regular_user' role.
    // This is done to establish a many-to-many relationship between users and roles.

    await prisma.userRoles.create({
      data: {
        user_id: user.id,
        role_id: role.id,
      },
    });

    const redis_key = `otp:${email}`;

    await sendOtpToEmail(
      user,
      'Confirm your registration',
      confirmRegistrationMessage,
      redis_key,
    );

    const user_obj = exclude(user, ['password', 'lastLogin']);

    return sendResponse(res, 201, true, 'User registered successfully', {
      ...user_obj,
    });
  } catch (error) {
    next(error);
  }
};

export const createStaff = async(req, res, next) => {
  try {
    const { email, first_name, last_name, password, phone_number } = req.body;

    // Check if user already exists by email or username
    const user_exist = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone_number }],
      },
    });

    if (user_exist) {
      return sendResponse(res, 400, false, 'User Already Exists');
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
      },
    });

    if (!user) {
      return sendResponse(res, 500, false, 'Failed to register user');
    }

    // This query fetches the role with the name 'regular_user' from the database.
    // If the role does not exist, it returns an error response.
    // The role is then assigned to the newly created user.

    const role = await prisma.roles.findUnique({
      where: { name: 'staff' },
    });

    if (!role) {
      return sendResponse(res, 500, false, ' role not found');
    }

    // This query creates a new entry in the userRoles table, linking the user with the 'admin' role.
    // This is done to establish a many-to-many relationship between users and roles.

    await prisma.userRoles.create({
      data: {
        user_id: user.id,
        role_id: role.id,
      },
    });

    const user_obj = exclude(user, ['password']);

    return sendResponse(
      res,
      201,
      true,
      'Your signup as a staff was successful',
      { ...user_obj },
      user.status,
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async(req, res, next) => {
  try {
    const { email, password } = req.body;

    // "Hey database, find this user by their email, and while you're at it, also show me all their roles, and inside each role, show me the role details so if they have two roles it will show array of roles for admin and the details and then for customer and the details."

    const user_exist = await prisma.user.findUnique({
      where: { email },
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

    // This captures the current date and time when the user is logging in.
    const currentLogin = new Date();
    // This is a ternary operator checking whether the user has logged in before.user_exist.lastLogin is a value stored in the database representing the previous login time.
    const previousLogin = user_exist.lastLogin
      ? new Date(user_exist.lastLogin).toLocaleString()
      : currentLogin.toLocaleString(); // use current login time on first login

    // Update lastLogin to current time
    await prisma.user.update({
      where: { email },
      data: {
        lastLogin: currentLogin,
      },
    });

    const redis_key = `auth_token:${user_exist.id}`;

    await redisClient.set(redis_key, token, {
      EX: parseInt(process.env.EXP_TIME),
    });

    const user_obj = exclude(user_exist, [
      'password',
      'roles',
      'created_at',
      'updated_at',
    ]);
    const roleName = user_exist.roles[0]?.role?.name;
    // if the user has multiple roles, you can handle that logic here as needed like this
    // const roleNames = user_exist.roles.map(role => role.role.name).join(', '); we use join to convert the array of role names into a string
    // Without join you will get ["Admin", "Customer"]
    // with join you will get "Admin, Customer"

    await sendMail(
      user_exist.email,
      'Login Notification',
      loginMessage(user_exist.first_name, previousLogin),
    );
    return sendResponse(res, 200, true, 'Logged in successfully', {
      ...user_obj,
      role: { roleName },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const validateAccount = async(req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    const redis_Key = `otp:${email}`;

    await sendOtpToEmail(
      user,
      'Validate your account',
      validateAccountMessage,
      redis_Key,
    );

    return sendResponse(res, 200, true, 'OTP sent successfully', user.email);
  } catch (error) {
    next(error);
  }
};

export const verifyResetOtp = async(req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    const redis_key = `otp:${email}`;
    const savedOtp = await getSavedOtp(redis_key);

    if (!savedOtp) {
      return sendResponse(res, 400, false, 'OTP expired or missing');
    }
    if (savedOtp !== otp) {
      return sendResponse(res, 400, false, 'Invalid OTP');
    }

    await sendMail(
      user.email,
      'OTP verified, you can now reset your password',
      'Your OTP has been verified successfully. You can now reset your password.',
    );
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async(req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return sendResponse(res, 200, true, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};

export const verifyRegistrationOtp = async(req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    const redisKey = `otp:${email}`;
    const savedOtp = await getSavedOtp(redisKey);

    if (!savedOtp) {
      return sendResponse(res, 400, false, 'OTP expired or missing');
    }
    if (savedOtp !== otp) {
      return sendResponse(res, 400, false, 'Invalid OTP');
    }

    // Activate user

    await prisma.user.update({
      where: { email },
      data: { status: 'ACTIVE' },
    });

    // Create wallet
    await prisma.wallet.create({
      data: {
        user_id: user.id,
        account_number: await generateAccountNumber(),
        account_name: `${user.first_name} ${user.last_name}`,
      },
    });

    await sendMail(
      user.email,
      'Registration Successful',
      registerMessage(user.first_name, user.last_name),
    );

    await deleteOtp(redisKey);
    return sendResponse(res, 200, true, 'Registration verified successfully');
  } catch (error) {
    next(error);
  }
};

export const verifyResetPasswordOtp = async(req, res, next) => {
  try {
    const { email, otp, new_password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    const redisKey = `otp:${email}`;
    const savedOtp = await getSavedOtp(redisKey);

    if (!savedOtp) {
      return sendResponse(res, 400, false, 'OTP expired or missing');
    }
    if (savedOtp !== otp) {
      return sendResponse(res, 400, false, 'Invalid OTP');
    }

    if (!new_password) {
      return sendResponse(res, 400, false, 'New password required');
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await deleteOtp(redisKey);
    return sendResponse(res, 200, true, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async(req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // this function checks if the user is already active
    if (user.status === 'ACTIVE') {
      return sendResponse(res, 400, false, 'User is already active');
    }

    // store the OTP in Redis with a key based on the user's email
    const redis_key = `otp:${email}`;

    await sendOtpToEmail(
      user,
      'Verify your email address',
      otpMessage,
      redis_key,
    );

    return sendResponse(res, 200, true, 'OTP resent successfully', user.email);
  } catch (error) {
    next(error);
  }
};
