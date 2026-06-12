import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/prisma';
import { getJwtSecret } from '../config/auth';
import {
  generateTwoFactorSecret,
  generateQrCodeDataUrl,
  verifyTotpCode,
} from '../services/twoFactor.service';

const JWT_SECRET = getJwtSecret();

export const getTwoFactorStatus = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { twoFactorEnabled: true, isGoogleUser: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ enabled: user.twoFactorEnabled, canEnable: !user.isGoogleUser });
  } catch {
    res.status(500).json({ error: 'Failed to fetch 2FA status' });
  }
};

export const setupTwoFactor = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isGoogleUser) {
      return res.status(400).json({ error: '2FA is not available for Google sign-in accounts.' });
    }
    if (user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is already enabled. Disable it first to reconfigure.' });
    }

    const { secret, otpauthUrl } = await generateTwoFactorSecret(user.email);
    const qrCode = await generateQrCodeDataUrl(otpauthUrl);

    // Store pending secret (not yet enabled)
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    });

    res.json({ qrCode, secret, message: 'Scan the QR code with your authenticator app, then confirm with a code.' });
  } catch (err) {
    console.error('2FA setup error:', err);
    res.status(500).json({ error: 'Failed to set up 2FA' });
  }
};

export const enableTwoFactor = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Verification code is required' });

    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user?.twoFactorSecret) {
      return res.status(400).json({ error: 'Run 2FA setup first' });
    }

    if (!(await verifyTotpCode(user.twoFactorSecret, code))) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    });

    res.json({ message: 'Two-factor authentication enabled successfully.' });
  } catch {
    res.status(500).json({ error: 'Failed to enable 2FA' });
  }
};

export const disableTwoFactor = async (req: AuthRequest, res: Response) => {
  try {
    const { code, password } = req.body;
    if (!code || !password) {
      return res.status(400).json({ error: 'Password and verification code are required' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA is not enabled' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    if (!(await verifyTotpCode(user.twoFactorSecret, code))) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });

    res.json({ message: 'Two-factor authentication disabled.' });
  } catch {
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
};

export const verifyTwoFactorLogin = async (req: AuthRequest, res: Response) => {
  try {
    const { tempToken, code } = req.body;
    if (!tempToken || !code) {
      return res.status(400).json({ error: 'tempToken and code are required' });
    }

    let payload: any;
    try {
      payload = jwt.verify(tempToken, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }

    if (payload.purpose !== '2fa' || !payload.userId) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user?.twoFactorSecret || !user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is not enabled for this account' });
    }

    if (!(await verifyTotpCode(user.twoFactorSecret, code))) {
      return res.status(401).json({ error: 'Invalid verification code' });
    }

    // Issue full tokens — reuse auth controller pattern via dynamic import to avoid circular deps
    const { issueTokensForUser } = await import('./auth.controller');
    const expiresIn = payload.rememberMe ? '30d' : '7d';
    const tokens = await issueTokensForUser(user.id, expiresIn);

    res.json({
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        isGoogleUser: user.isGoogleUser,
        twoFactorEnabled: true,
      },
    });
  } catch (err) {
    console.error('2FA verify login error:', err);
    res.status(500).json({ error: 'Failed to verify 2FA code' });
  }
};
