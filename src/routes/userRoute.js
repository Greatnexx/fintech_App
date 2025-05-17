import express from "express"
import { createUser } from "../controllers/Users/register.js";
import { loginUser } from "../controllers/Users/auth.js";
import { validateLogin, validateRegister } from "../services/validation.js";

const router = express.Router();

router.post("/users",validateRegister,createUser)
router.post("/users/auth",validateLogin,loginUser)


export default router;