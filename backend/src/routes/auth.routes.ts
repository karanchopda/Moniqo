import { Router } from 'express';
import { 
  signup, 
  login, 
  verifyEmail, 
  resendVerification,
  forgotPassword,
  resetPassword,
  googleLogin
} from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleLogin);

export default router;
