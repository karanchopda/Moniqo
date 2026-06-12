import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getSubscription,
  createCheckout,
  createPortal,
  handleStripeWebhook,
} from '../controllers/payment.controller';

const router = Router();

router.get('/subscription', authenticate, getSubscription);
router.post('/checkout', authenticate, createCheckout);
router.post('/portal', authenticate, createPortal);
router.post('/webhook', handleStripeWebhook);

export default router;
