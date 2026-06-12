import QRCode from 'qrcode';

const APP_NAME = 'Moniqo';

let otplibModule: typeof import('otplib') | null = null;

async function getOtplib() {
  if (!otplibModule) {
    otplibModule = await import('otplib');
  }
  return otplibModule;
}

export async function generateTwoFactorSecret(email: string): Promise<{ secret: string; otpauthUrl: string }> {
  const { generateSecret, generateURI } = await getOtplib();
  const secret = generateSecret();
  const otpauthUrl = generateURI({
    issuer: APP_NAME,
    label: email,
    secret,
  });
  return { secret, otpauthUrl };
}

export async function generateQrCodeDataUrl(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl);
}

export async function verifyTotpCode(secret: string, token: string): Promise<boolean> {
  try {
    const { verifySync } = await getOtplib();
    const result = verifySync({ secret, token: token.replace(/\s/g, ''), epochTolerance: 1 });
    return result.valid;
  } catch {
    return false;
  }
}
