import { Router } from 'express';
import { default as userRoutes } from '../routes/userRoute.js';

const router = Router();

router.use('/users', userRoutes);

export default router;
