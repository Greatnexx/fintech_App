import { Router } from 'express';
import { default as userRoutes } from '../routes/userRoute.js';
<<<<<<< HEAD
import { default as transactionRoute } from '../routes/transaction.js';
import { default as webhookRoute } from '../routes/webhook.js';
=======
import { default as transferRoute } from '../routes/transfer.js';
import { default as webhookRoute } from '../routes/webhook.js';
import { default as WithdrawalRoute } from '../routes/withdrawal.js';
import { default as DepositRoute } from '../routes/deposit.js';
>>>>>>> 3fe7e3c (squashing commit)

const router = Router();

router.use('/users', userRoutes);
<<<<<<< HEAD
router.use('/initiate', transactionRoute);
=======
router.use('/transfer', transferRoute);
router.use('/withdrawal', WithdrawalRoute);
router.use('/deposit', DepositRoute);
>>>>>>> 3fe7e3c (squashing commit)
router.use('/paystack', webhookRoute);

export default router;
