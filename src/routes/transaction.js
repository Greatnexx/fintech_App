import express from 'express'
import { initiateDeposit } from '../controllers/Transactions/deposit.js';
import { protect } from '../middlewares/authMiddleWare.js';
import { initiateTransfer, verifyTransfer } from '../controllers/Transactions/transfer.js';
import { initiateWithdrawal, verifyWithdrawal } from '../controllers/Transactions/widrawal.js';

const router = express.Router();

router.post('/deposit',protect, initiateDeposit);
router.post('/transfer',protect, initiateTransfer);
router.post('/verify-transfer',protect, verifyTransfer);
router.post('/withdrawal',protect, initiateWithdrawal);
router.post('/verify-withdrawal',protect, verifyWithdrawal);




export default router