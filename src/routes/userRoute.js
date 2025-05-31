import express from 'express';
import { createUser } from '../controllers/Users/createCustomer.js';
import { loginUser } from '../controllers/Users/auth.js';
import { validateLogin, validateProfile, validateRegister, validateStaffRegister } from '../services/validation.js';
import { createStaff } from '../controllers/Users/createStaff.js';
import { protect } from '../middlewares/authMiddleWare.js';
import { createUserProfile } from '../controllers/Users/createProfile.js';
import { getUserProfile } from '../controllers/Users/getProfile.js';

const router = express.Router();

router.post('/create-customer',validateRegister,createUser);
router.post('/create-staff', validateStaffRegister,createStaff);
router.post('/auth',validateLogin,loginUser);
router.post('/create-profile',protect,validateProfile, createUserProfile);
router.get('/profile',protect,getUserProfile);

export default router;
