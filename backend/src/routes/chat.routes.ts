import { Router } from 'express';
import { getCoachResponse } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';
import { chatValidation } from '../middleware/validation.middleware';

const router = Router();

router.post('/coach', authenticate as any, chatValidation, getCoachResponse as any);

export default router;
