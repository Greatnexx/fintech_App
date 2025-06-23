import express from 'express';
import { validateLogin, validateProfile, validateRegister, validateStaffRegister } from '../services/validation.js';
import { createUserProfile, getUserProfile } from '../controllers/Users/profile.js';
import { createStaff, createUser, loginUser, resendOtp, resetPassword, validateAccount, verifyRegistrationOtp,  verifyResetPasswordOtp } from '../controllers/Users/auth.js';
import { protect } from '../middlewares/authMiddleWare.js';

const router = express.Router();

router.post('/create-customer',validateRegister,createUser);
router.post('/create-staff', validateStaffRegister,createStaff);
router.post('/auth',validateLogin,loginUser);
router.post('/create-profile',protect,validateProfile, createUserProfile);
router.get('/profile',protect,getUserProfile);
router.post('/verify-email-otp',verifyRegistrationOtp);
router.post('/resend-verification-otp', resendOtp);
router.post('/request-password-reset', validateAccount); 
router.post('/verify-reset-otp', verifyResetPasswordOtp);
router.post('/reset-password', resetPassword);


export default router;
