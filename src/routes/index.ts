import { Router } from 'express';
import endpoint1Router from './endpoint1';
import endpoint2Router from './endpoint2';
import csrfRouter from './csrf';

const router = Router();

router.use('/endpoint1', endpoint1Router);
router.use('/endpoint2', endpoint2Router);
router.use('/csrf', csrfRouter);

export default router;