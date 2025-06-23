import express from "express"
import { handlePaystackWebhook } from "../controllers/Transactions/webhook.js";


const router = express.Router();

router.post('/webhook', handlePaystackWebhook)

export default router;