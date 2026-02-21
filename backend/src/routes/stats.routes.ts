import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.use(authenticate);

router.get('/overview', statsController.getOverview);

export default router;
