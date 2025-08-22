import express from 'express';
import { initiateDeposit } from '../controllers/Transactions/deposit.js';
import { protect } from '../middlewares/authMiddleWare.js';
// import { initiateTransfer, verifyTransfer } from '../controllers/Transactions/transfer.js';
// import { initiateWithdrawal } from '../controllers/Transactions/widrawal.js';
import { initiateTransfer } from '../controllers/Transactions/transfer.js';

const router = express.Router();

router.post('/deposit',protect, initiateDeposit);
router.post('/transfer',protect, initiateTransfer);
// router.post('/verify-transfer',protect, verifyTransfer);
// router.post('/withdrawal',protect, initiateWithdrawal);

export default router;
