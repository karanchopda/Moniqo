import { Router } from 'express';
import { generateReport, getLatestReport } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', authenticate, generateReport);
router.get('/latest', authenticate, getLatestReport);

export default router;
