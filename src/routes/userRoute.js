import express from 'express';
import { createUser } from '../controllers/Users/createCustomer.js';
import { loginUser } from '../controllers/Users/auth.js';
import { validateLogin, validateProfile, validateRegister, validateStaffRegister } from '../services/validation.js';
import { createStaff } from '../controllers/Users/createStaff.js';
import { protect } from '../middlewares/authMiddleWare.js';
import { createUserProfile } from '../controllers/Users/createProfile.js';
import { getUserProfile } from '../controllers/Users/getProfile.js';
import { validateAccount } from '../controllers/Users/validateAccount.js';
import { verifyOtp } from '../controllers/Users/validateOtp.js';
import { resetPassword } from '../controllers/Users/resetPassword.js';

const router = express.Router();

router.post('/create-customer',validateRegister,createUser);
router.post('/create-staff', validateStaffRegister,createStaff);
router.post('/auth',validateLogin,loginUser);
router.post('/create-profile',protect,validateProfile, createUserProfile);
router.get('/profile',protect,getUserProfile);
router.post('/validate-account',validateAccount);
router.post('/validate-otp',verifyOtp)
router.post('/validate-otp',verifyOtp)
router.post('/reset-password',resetPassword)

export default router;
