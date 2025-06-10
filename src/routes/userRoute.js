import express from 'express';
import { validateLogin, validateProfile, validateRegister, validateStaffRegister } from '../services/validation.js';
import { createUserProfile, getUserProfile } from '../controllers/Users/profile.js';
import { createStaff, loginUser, resetPassword, validateAccount, verifyOtp } from '../controllers/Users/auth.js';
import { protect } from '../middlewares/authMiddleWare.js';


const router = express.Router();

router.post('/create-customer',validateRegister,protect,createUserProfile);
router.post('/create-staff', validateStaffRegister,createStaff);
router.post('/auth',validateLogin,loginUser);
router.post('/create-profile',protect,validateProfile, createUserProfile);
router.get('/profile',protect,getUserProfile);
router.post('/validate-account',validateAccount);
router.post('/validate-otp',verifyOtp);
router.post('/reset-password',resetPassword);

export default router;
