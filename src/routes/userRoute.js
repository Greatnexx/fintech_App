import express from "express"
import { createUser } from "../controllers/Users/register.js";
import { loginUser } from "../controllers/Users/auth.js";
import { validateLogin, validateRegister, validateStaffRegister } from "../services/validation.js";
import { createStaff } from "../controllers/Users/createStaff.js";
import { isRegularUser, isStaff, protect } from "../api/middlewares/authMiddleWare.js";
import { createUserProfile } from "../controllers/Profiles/createUserProfile.js";
import { getUserProfile } from "../controllers/Profiles/getProfile.js";

const router = express.Router();

router.post("/users/create-customer",validateRegister,createUser)
router.post("/users/create-staff", validateStaffRegister,createStaff)
router.post("/users/auth",validateLogin,loginUser)
router.post("/users/create-profile",protect, createUserProfile)
router.post("/users/profile",protect,getUserProfile)

export default router;