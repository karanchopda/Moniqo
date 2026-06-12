import { Router } from 'express';
import { 
  signup, 
  login, 
  verifyEmail, 
  resendVerification,
  forgotPassword,
  resetPassword,
  googleLogin,
  refreshAccessToken,
  logoutUser,
} from '../controllers/auth.controller';
import { verifyTwoFactorLogin } from '../controllers/twoFactor.controller';
import {
  signupValidation,
  loginValidation,
  emailValidation,
  resetPasswordValidation
} from '../middleware/validation.middleware';

const router = Router();

router.post('/signup',               signupValidation,        signup);
router.post('/login',                loginValidation,         login);
router.post('/verify-email',                                  verifyEmail);
router.post('/resend-verification',  emailValidation,         resendVerification);
router.post('/forgot-password',      emailValidation,         forgotPassword);
router.post('/reset-password',       resetPasswordValidation, resetPassword);
router.post('/google',                                        googleLogin);
router.post('/refresh',                                       refreshAccessToken);
router.post('/logout',                                        logoutUser);
router.post('/verify-2fa',                                    verifyTwoFactorLogin);

export default router;
