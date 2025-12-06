import { Router } from 'express';
import { statsController } from '../controllers';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/summary', requireAuth, requireRole('admin'), statsController.getSummary);

export default router;


