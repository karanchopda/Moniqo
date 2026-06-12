import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getTwoFactorStatus,
  setupTwoFactor,
  enableTwoFactor,
  disableTwoFactor,
  verifyTwoFactorLogin,
} from '../controllers/twoFactor.controller';

const router = Router();

router.get('/status', authenticate, getTwoFactorStatus);
router.post('/setup', authenticate, setupTwoFactor);
router.post('/enable', authenticate, enableTwoFactor);
router.post('/disable', authenticate, disableTwoFactor);

export default router;
