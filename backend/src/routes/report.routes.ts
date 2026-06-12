import { Router } from 'express';
import { generateReport, getLatestReport, smsScan, getRecurring } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', authenticate, generateReport);
router.get('/latest', authenticate, getLatestReport);
router.get('/recurring', authenticate, getRecurring);
router.post('/sms-scan', authenticate, smsScan);

export default router;

