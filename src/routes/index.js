import { Router } from 'express';
import { default as userRoutes } from '../routes/userRoute.js';
import { default as transactionRoute } from '../routes/transaction.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/initiate', transactionRoute);

export default router;
