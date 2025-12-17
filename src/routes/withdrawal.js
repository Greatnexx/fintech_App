import express from 'express';
import { createRecipient, initiateWithdrawal, resolveAccount } from '../controllers/Transactions/widrawal.js';
import { protect } from '../middlewares/authMiddleWare.js';

const router = express.Router();
router.post('/resolve-account', protect, resolveAccount);
router.post('/recipient', protect, createRecipient);
router.post('/initiate', protect, initiateWithdrawal);

export default router;
