/**
 * Validates required environment variables at startup and logs actionable warnings.
 */

interface EnvCheck {
  key: string;
  required: boolean;
  validate?: (value: string) => boolean;
  hint: string;
}

const PLACEHOLDER_PATTERNS = [/^sk-\.{3}$/, /^CHANGE_ME/, /^\[PASSWORD\]/, /^sb_secret_\.\.\.$/];

function isPlaceholder(value: string | undefined): boolean {
  if (!value?.trim()) return true;
  return PLACEHOLDER_PATTERNS.some((p) => p.test(value.trim()));
}

const checks: EnvCheck[] = [
  {
    key: 'DATABASE_URL',
    required: true,
    validate: (v) => v.startsWith('postgresql://') || v.startsWith('postgres://'),
    hint: 'Set DATABASE_URL to your Supabase/PostgreSQL connection string.',
  },
  {
    key: 'JWT_SECRET',
    required: true,
    validate: (v) => v.length >= 32 && !isPlaceholder(v),
    hint: 'Generate one: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"',
  },
  {
    key: 'OPENAI_API_KEY',
    required: false,
    validate: (v) => v.startsWith('sk-') && !isPlaceholder(v),
    hint: 'Get a key at https://platform.openai.com/api-keys — required for AI Coach, reports, and PDF OCR.',
  },
  {
    key: 'SMTP_HOST',
    required: false,
    hint: 'Set SMTP_HOST, SMTP_USER, SMTP_PASS for real email delivery (verification & password reset).',
  },
  {
    key: 'STRIPE_SECRET_KEY',
    required: false,
    validate: (v) => v.startsWith('sk_'),
    hint: 'Get keys at https://dashboard.stripe.com/apikeys — required for billing.',
  },
];

export function validateEnv(): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const check of checks) {
    const value = process.env[check.key];

    if (!value?.trim()) {
      if (check.required) errors.push(`  ✗ ${check.key} — missing. ${check.hint}`);
      else if (check.key === 'OPENAI_API_KEY') warnings.push(`  ⚠ ${check.key} — not set. AI features will use fallbacks. ${check.hint}`);
      else if (check.key === 'SMTP_HOST') {
        const smtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;
        if (!smtpConfigured) warnings.push(`  ⚠ SMTP — not configured. Emails print to console. ${check.hint}`);
      } else if (check.key === 'STRIPE_SECRET_KEY') {
        warnings.push(`  ⚠ Stripe — not configured. Billing checkout disabled. ${check.hint}`);
      }
      continue;
    }

    if (check.validate && !check.validate(value)) {
      if (check.required) errors.push(`  ✗ ${check.key} — invalid or placeholder. ${check.hint}`);
      else warnings.push(`  ⚠ ${check.key} — looks like a placeholder. ${check.hint}`);
    }
  }

  // SMTP partial config
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (SMTP_HOST && (!SMTP_USER || !SMTP_PASS)) {
    warnings.push('  ⚠ SMTP_HOST is set but SMTP_USER/SMTP_PASS missing — emails will fall back to console.');
  }

  if (errors.length) {
    console.error('\n❌ Environment configuration errors:\n' + errors.join('\n') + '\n');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  if (warnings.length) {
    console.warn('\n⚠️  Environment warnings:\n' + warnings.join('\n') + '\n');
  } else {
    console.log('✅ Environment configuration looks good.');
  }

  // Feature status summary
  const openaiOk = process.env.OPENAI_API_KEY && !isPlaceholder(process.env.OPENAI_API_KEY);
  const smtpOk = SMTP_HOST && SMTP_USER && SMTP_PASS;
  const stripeOk = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_');

  console.log(`   OpenAI: ${openaiOk ? 'enabled' : 'fallback mode'}`);
  console.log(`   Email:  ${smtpOk ? 'SMTP configured' : 'console fallback'}`);
  console.log(`   Stripe: ${stripeOk ? 'enabled' : 'disabled'}\n`);
}

export function isSmtpConfigured(): boolean {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  return !!(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

export function isOpenAiConfigured(): boolean {
  const key = process.env.OPENAI_API_KEY;
  return !!(key && key.startsWith('sk-') && !isPlaceholder(key));
}

export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_'));
}
