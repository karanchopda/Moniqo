import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/prisma';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        isGoogleUser: true,
        notificationPrefs: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name?.trim() && !email?.trim()) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email: email.trim().toLowerCase(), NOT: { id: req.userId! } },
      });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
    }

    const updated = await prisma.user.update({
      where: { id: req.userId! },
      data: {
        ...(name  && { name: name.trim() }),
        ...(email && { email: email.trim().toLowerCase() }),
      },
      select: { id: true, email: true, name: true, emailVerified: true, isGoogleUser: true },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Google-only users have a random hash — they can't use a current password
    if (user.isGoogleUser) {
      return res.status(400).json({
        error: 'Your account uses Google sign-in. Password change is not available.',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.userId! }, data: { password: hashed } });

    res.json({ message: 'Password updated successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const updateNotificationPrefs = async (req: AuthRequest, res: Response) => {
  try {
    const { emailAlerts, weeklyDigest, aiPrompts } = req.body;

    const prefs = {
      emailAlerts:  typeof emailAlerts  === 'boolean' ? emailAlerts  : true,
      weeklyDigest: typeof weeklyDigest === 'boolean' ? weeklyDigest : false,
      aiPrompts:    typeof aiPrompts    === 'boolean' ? aiPrompts    : true,
    };

    await prisma.user.update({
      where: { id: req.userId! },
      data: { notificationPrefs: prefs },
    });

    res.json({ message: 'Notification preferences saved', prefs });
  } catch {
    res.status(500).json({ error: 'Failed to save preferences' });
  }
};
