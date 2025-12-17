import express from 'express';
import { protect } from '../middlewares/authMiddleWare.js';
import { initiateTransfer } from '../controllers/Transactions/transfer.js';
import { validateTransaction } from '../services/validation.js';

const router = express.Router();

router.post('/transfer',protect, validateTransaction, initiateTransfer);

export default router;
