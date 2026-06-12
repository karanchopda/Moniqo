import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/prisma';
import { getJwtSecret } from '../config/auth';
import {
  generateVerificationToken,
  generateVerificationExpiry,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from '../services/email.service';

const JWT_SECRET = getJwtSecret();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function signAccessToken(userId: string, expiresIn = '7d') {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn } as any);
}

function makeRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

function refreshExpiry() {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
}

function userPayload(user: any) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerified: user.emailVerified,
    isGoogleUser: user.isGoogleUser,
    twoFactorEnabled: user.twoFactorEnabled ?? false,
    plan: user.plan ?? 'free',
  };
}

async function issueTokens(userId: string, expiresIn = '7d') {
  const token = signAccessToken(userId, expiresIn);
  const refreshToken = makeRefreshToken();
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken, refreshTokenExpiry: refreshExpiry() },
  });
  return { token, refreshToken };
}

/** Exported for 2FA login completion */
export async function issueTokensForUser(userId: string, expiresIn = '7d') {
  return issueTokens(userId, expiresIn);
}

function signTwoFactorTempToken(userId: string, rememberMe: boolean) {
  return jwt.sign({ userId, purpose: '2fa', rememberMe }, JWT_SECRET, { expiresIn: '5m' });
}

// ─── Controllers ─────────────────────────────────────────────────────────────

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const verificationExpires = generateVerificationExpiry();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name?.trim() || null,
        verificationToken,
        verificationExpires,
        emailVerified: false,
      },
    });

    await sendVerificationEmail(email, verificationToken);
    const { token, refreshToken } = await issueTokens(user.id);

    res.status(201).json({
      token,
      refreshToken,
      user: userPayload(user),
      message: 'Account created! Please check your email to verify your account.',
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // If 2FA is enabled, return a temp token instead of full session
    if (user.twoFactorEnabled) {
      const tempToken = signTwoFactorTempToken(user.id, !!rememberMe);
      return res.json({
        requires2FA: true,
        tempToken,
        message: 'Enter the code from your authenticator app.',
      });
    }

    const expiresIn = rememberMe ? '30d' : '7d';
    const { token, refreshToken } = await issueTokens(user.id, expiresIn);

    res.json({ token, refreshToken, user: userPayload(user) });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const randomPassword =
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).slice(-10) +
        'A1!';
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name?.trim() || null,
          isGoogleUser: true,
          emailVerified: true,
        },
      });
      await sendWelcomeEmail(email);
    } else if (!user.emailVerified) {
      user = await prisma.user.update({
        where: { email },
        data: { emailVerified: true },
      });
    }

    const { token, refreshToken } = await issueTokens(user.id);
    res.json({ token, refreshToken, user: userPayload(user) });
  } catch (error: any) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const user = await prisma.user.findFirst({
      where: { refreshToken },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    if (!user.refreshTokenExpiry || user.refreshTokenExpiry < new Date()) {
      return res.status(401).json({ error: 'Refresh token expired. Please log in again.' });
    }

    // Rotate: issue a new access token and a new refresh token
    const { token, refreshToken: newRefreshToken } = await issueTokens(user.id);

    res.json({ token, refreshToken: newRefreshToken, user: userPayload(user) });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      // Invalidate the refresh token in DB
      await prisma.user.updateMany({
        where: { refreshToken },
        data: { refreshToken: null, refreshTokenExpiry: null },
      });
    }
    res.json({ message: 'Logged out successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to logout' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Verification token is required' });

    const user = await prisma.user.findUnique({ where: { verificationToken: token } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired verification token' });

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null, verificationExpires: null },
    });

    await sendWelcomeEmail(user.email);

    const { token: accessToken, refreshToken } = await issueTokens(user.id);

    res.json({
      message: 'Email verified successfully!',
      token: accessToken,
      refreshToken,
      user: userPayload(updatedUser),
    });
  } catch (error: any) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.emailVerified) return res.status(400).json({ error: 'Email is already verified' });

    const verificationToken = generateVerificationToken();
    const verificationExpires = generateVerificationExpiry();

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken, verificationExpires },
    });

    await sendVerificationEmail(email, verificationToken);
    res.json({ message: 'Verification email sent! Please check your inbox.' });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether the account exists
      return res.json({ message: 'If an account exists, a password reset email has been sent.' });
    }

    const resetToken = generateVerificationToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken, resetPasswordExpires: resetExpires },
    });

    await sendPasswordResetEmail(email, resetToken);
    res.json({ message: 'If an account exists, a password reset email has been sent.' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const user = await prisma.user.findUnique({ where: { resetPasswordToken: token } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' });

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
    });

    res.json({ message: 'Password reset successfully!' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
