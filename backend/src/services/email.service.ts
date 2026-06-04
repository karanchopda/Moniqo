import crypto from 'crypto';
import nodemailer from 'nodemailer';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://moniqoai.vercel.app';
const FROM_ADDRESS = process.env.EMAIL_FROM || 'Moniqo <noreply@moniqo.com>';

// Build a transporter when SMTP credentials are present.
// Falls back to console logging in development so the app works without any config.
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

const transporter = createTransporter();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: EmailOptions): Promise<void> {
  if (!transporter) {
    // Development fallback — print the link so devs can click it
    console.log('\n📧 [Email not configured — console fallback]');
    console.log(`To:      ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    const match = options.html.match(/href="([^"]+)"/);
    if (match) console.log(`Link:    ${match[1]}`);
    console.log('');
    return;
  }

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateVerificationExpiry(): Date {
  // Token expires in 24 hours
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Moniqo</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #00331C; padding: 40px 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #7FE5B8; font-size: 32px; font-weight: bold;">MONIQO</h1>
                  <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Your Financial Intelligence Platform</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #00331C; font-size: 24px; font-weight: bold;">Verify Your Email Address</h2>
                  
                  <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                    Thank you for signing up with Moniqo! To complete your registration and start managing your wealth with AI-powered insights, please verify your email address.
                  </p>
                  
                  <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                    Click the button below to verify your email:
                  </p>
                  
                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 0 0 30px;">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background-color: #7FE5B8; color: #00331C; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.6;">
                    Or copy and paste this link into your browser:
                  </p>
                  
                  <p style="margin: 0 0 30px; padding: 15px; background-color: #f5f5f5; border-radius: 8px; font-size: 13px; word-break: break-all;">
                    <a href="${verificationUrl}" style="color: #00331C; text-decoration: none;">${verificationUrl}</a>
                  </p>
                  
                  <p style="margin: 0 0 10px; color: #999999; font-size: 13px; line-height: 1.6;">
                    This link will expire in 24 hours for security reasons.
                  </p>
                  
                  <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.6;">
                    If you didn't create an account with Moniqo, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f5f5; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                    © 2026 Moniqo. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    Your AI-powered financial intelligence platform
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  await sendEmail({
    to: email,
    subject: 'Verify Your Email - Moniqo',
    html
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Moniqo</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #00331C; padding: 40px 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #7FE5B8; font-size: 32px; font-weight: bold;">MONIQO</h1>
                  <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Your Financial Intelligence Platform</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #00331C; font-size: 24px; font-weight: bold;">Reset Your Password</h2>
                  
                  <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                    We received a request to reset your password for your Moniqo account. Click the button below to create a new password.
                  </p>
                  
                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 0 0 30px;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background-color: #7FE5B8; color: #00331C; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.6;">
                    Or copy and paste this link into your browser:
                  </p>
                  
                  <p style="margin: 0 0 30px; padding: 15px; background-color: #f5f5f5; border-radius: 8px; font-size: 13px; word-break: break-all;">
                    <a href="${resetUrl}" style="color: #00331C; text-decoration: none;">${resetUrl}</a>
                  </p>
                  
                  <p style="margin: 0 0 10px; color: #999999; font-size: 13px; line-height: 1.6;">
                    This link will expire in 1 hour for security reasons.
                  </p>
                  
                  <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.6;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f5f5; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                    © 2026 Moniqo. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    Your AI-powered financial intelligence platform
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  await sendEmail({
    to: email,
    subject: 'Reset Your Password - Moniqo',
    html
  });
}

export async function sendWelcomeEmail(email: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Moniqo</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #00331C; padding: 40px 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #7FE5B8; font-size: 32px; font-weight: bold;">MONIQO</h1>
                  <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Your Financial Intelligence Platform</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #00331C; font-size: 24px; font-weight: bold;">Welcome to Moniqo! 🎉</h2>
                  
                  <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                    Your email has been verified successfully! You're now ready to start your journey towards financial clarity and intelligent wealth management.
                  </p>
                  
                  <h3 style="margin: 30px 0 15px; color: #00331C; font-size: 18px; font-weight: bold;">What's Next?</h3>
                  
                  <ul style="margin: 0 0 30px; padding-left: 20px; color: #666666; font-size: 15px; line-height: 1.8;">
                    <li>Upload your transaction statements (PDF/CSV)</li>
                    <li>Get AI-powered insights on your spending patterns</li>
                    <li>Discover money leaks and optimization opportunities</li>
                    <li>Chat with your personal AI financial coach</li>
                    <li>Track your progress towards financial goals</li>
                  </ul>
                  
                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 0 0 30px;">
                        <a href="${FRONTEND_URL}/dashboard" style="display: inline-block; padding: 16px 40px; background-color: #7FE5B8; color: #00331C; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
                          Go to Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                    If you have any questions, feel free to reach out to our support team. We're here to help you achieve financial clarity!
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f5f5; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                    © 2026 Moniqo. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    Your AI-powered financial intelligence platform
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  await sendEmail({
    to: email,
    subject: 'Welcome to Moniqo! 🎉',
    html
  });
}
