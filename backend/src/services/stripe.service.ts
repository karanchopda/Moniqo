import Stripe from 'stripe';
import { isStripeConfigured } from '../config/env';

let stripeInstance: InstanceType<typeof Stripe> | null = null;

function getStripe() {
  if (!isStripeConfigured()) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY in your environment.');
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeInstance;
}

export type PlanTier = 'pro' | 'elite';
export type BillingInterval = 'monthly' | 'yearly';

const PRICE_ENV_KEYS: Record<PlanTier, Record<BillingInterval, string>> = {
  pro: {
    monthly: 'STRIPE_PRICE_PRO_MONTHLY',
    yearly: 'STRIPE_PRICE_PRO_YEARLY',
  },
  elite: {
    monthly: 'STRIPE_PRICE_ELITE_MONTHLY',
    yearly: 'STRIPE_PRICE_ELITE_YEARLY',
  },
};

export function getPriceId(plan: PlanTier, interval: BillingInterval): string {
  const envKey = PRICE_ENV_KEYS[plan][interval];
  const priceId = process.env[envKey];
  if (!priceId || priceId.startsWith('price_...')) {
    throw new Error(`Stripe price not configured. Set ${envKey} in your environment.`);
  }
  return priceId;
}

export async function getOrCreateCustomer(
  email: string,
  userId: string,
  existingCustomerId?: string | null
): Promise<string> {
  const client = getStripe();
  if (existingCustomerId) return existingCustomerId;

  const customer = await client.customers.create({
    email,
    metadata: { userId },
  });
  return customer.id;
}

export async function createCheckoutSession(opts: {
  customerId: string;
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const client = getStripe();
  const session = await client.checkout.sessions.create({
    customer: opts.customerId,
    mode: 'subscription',
    line_items: [{ price: opts.priceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    metadata: { userId: opts.userId },
    subscription_data: { metadata: { userId: opts.userId } },
  });

  if (!session.url) throw new Error('Failed to create checkout session');
  return session.url;
}

export async function createBillingPortalSession(customerId: string, returnUrl: string): Promise<string> {
  const client = getStripe();
  const session = await client.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}

export function planFromPriceId(priceId: string): PlanTier | null {
  const proPrices = [process.env.STRIPE_PRICE_PRO_MONTHLY, process.env.STRIPE_PRICE_PRO_YEARLY];
  const elitePrices = [process.env.STRIPE_PRICE_ELITE_MONTHLY, process.env.STRIPE_PRICE_ELITE_YEARLY];
  if (proPrices.includes(priceId)) return 'pro';
  if (elitePrices.includes(priceId)) return 'elite';
  return null;
}

export { getStripe };
