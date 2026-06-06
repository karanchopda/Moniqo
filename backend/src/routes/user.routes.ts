import { Router } from 'express';
import { getProfile, updateProfile, changePassword, updateNotificationPrefs } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

router.get('/profile', authenticate, getProfile);

router.put('/profile', authenticate, [
  body('name').optional().trim().isLength({ max: 100 }).withMessage('Name must be 100 chars or fewer'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email'),
  handleValidationErrors,
], updateProfile);

router.put('/change-password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  handleValidationErrors,
], changePassword);

router.put('/notification-prefs', authenticate, [
  body('emailAlerts').optional().isBoolean(),
  body('weeklyDigest').optional().isBoolean(),
  body('aiPrompts').optional().isBoolean(),
  handleValidationErrors,
], updateNotificationPrefs);

export default router;
