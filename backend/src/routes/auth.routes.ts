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
import {
  signupValidation,
  loginValidation,
  emailValidation,
  resetPasswordValidation
} from '../middleware/validation.middleware';

const router = Router();

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', emailValidation, resendVerification);
router.post('/forgot-password', emailValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.post('/google', googleLogin);

export default router;
