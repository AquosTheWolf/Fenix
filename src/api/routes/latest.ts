import { Router } from 'express';
import FDevsRouter from './fdevs';

const router = Router();

router.use('/fdevs', FDevsRouter);

export default router;