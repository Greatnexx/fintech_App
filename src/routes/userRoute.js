import express from "express"
import { createUser } from "../controllers/Users/register.js";
import { loginUser } from "../controllers/Users/auth.js";

const router = express.Router();

router.post("/users",createUser)
router.post("/users/auth",loginUser)


export default router;