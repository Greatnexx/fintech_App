import express from 'express';
import { initiateDeposit } from '../controllers/Transactions/deposit.js';
import { validateTransaction } from '../services/validation.js';
import { protect } from '../middlewares/authMiddleWare.js';

const router = express.Router();
router.post('/initiate', protect, validateTransaction, initiateDeposit);

export default router;
