import { Router } from 'express';
import { getCoachResponse } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/coach', authenticate as any, getCoachResponse as any);

export default router;
