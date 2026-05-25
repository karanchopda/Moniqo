import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { getJwtSecret } from '../config/auth';
import { 
  generateVerificationToken, 
  generateVerificationExpiry,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
} from '../services/email.service';

const JWT_SECRET = getJwtSecret();

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = generateVerificationExpiry();

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
        verificationExpires,
        emailVerified: false,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Generate token (user can use app but some features require verification)
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email,
        emailVerified: user.emailVerified
      },
      message: 'Account created! Please check your email to verify your account.'
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email,
        emailVerified: user.emailVerified
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    let user = await prisma.user.findUnique({ where: { email } });
    
    // Create user if they don't exist
    if (!user) {
      // Generate a random secure password since they log in via Google
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10) + 'A1!';
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          emailVerified: true, // Google verifies emails
        },
      });
      // Optionally send welcome email here
      await sendWelcomeEmail(email);
    } else if (!user.emailVerified) {
      // If user exists but wasn't verified, verify them now since Google vouches for it
      user = await prisma.user.update({
        where: { email },
        data: { emailVerified: true },
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email,
        emailVerified: user.emailVerified
      }
    });
  } catch (error: any) {
    console.error('Google login error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // Find user with this token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Check if token is expired
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null,
      }
    });

    // Send welcome email
    await sendWelcomeEmail(user.email);

    res.json({ message: 'Email verified successfully!' });
  } catch (error: any) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = generateVerificationExpiry();

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationExpires,
      }
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.json({ message: 'Verification email sent! Please check your inbox.' });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account exists, a password reset email has been sent.' });
    }

    // Generate reset token
    const resetToken = generateVerificationToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      }
    });

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'If an account exists, a password reset email has been sent.' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Find user with this token
    const user = await prisma.user.findUnique({
      where: { resetPasswordToken: token }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      }
    });

    res.json({ message: 'Password reset successfully!' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: error.message });
  }
};
