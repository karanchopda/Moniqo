import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/prisma';
import { isStripeConfigured } from '../config/env';
import {
  createBillingPortalSession,
  createCheckoutSession,
  getOrCreateCustomer,
  getPriceId,
  planFromPriceId,
  getStripe,
  PlanTier,
  BillingInterval,
} from '../services/stripe.service';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export const getSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { plan: true, stripeCustomerId: true, stripeSubscriptionId: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      plan: user.plan || 'free',
      stripeConfigured: isStripeConfigured(),
      hasSubscription: !!user.stripeSubscriptionId,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};

export const createCheckout = async (req: AuthRequest, res: Response) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ error: 'Billing is not configured yet. Contact support.' });
    }

    const { plan, interval = 'monthly' } = req.body as { plan: PlanTier; interval?: BillingInterval };
    if (!plan || !['pro', 'elite'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan. Choose pro or elite.' });
    }
    if (!['monthly', 'yearly'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid interval. Choose monthly or yearly.' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const priceId = getPriceId(plan, interval);
    const customerId = await getOrCreateCustomer(user.email, user.id, user.stripeCustomerId);

    if (customerId !== user.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const url = await createCheckoutSession({
      customerId,
      priceId,
      userId: user.id,
      successUrl: `${FRONTEND_URL}/dashboard/settings?tab=billing&success=1`,
      cancelUrl: `${FRONTEND_URL}/pricing?canceled=1`,
    });

    res.json({ url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message || 'Failed to create checkout session' });
  }
};

export const createPortal = async (req: AuthRequest, res: Response) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ error: 'Billing is not configured yet.' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user?.stripeCustomerId) {
      return res.status(400).json({ error: 'No billing account found. Subscribe to a plan first.' });
    }

    const url = await createBillingPortalSession(
      user.stripeCustomerId,
      `${FRONTEND_URL}/dashboard/settings?tab=billing`
    );
    res.json({ url });
  } catch (err: any) {
    console.error('Portal error:', err);
    res.status(500).json({ error: err.message || 'Failed to open billing portal' });
  }
};

export const handleStripeWebhook = async (req: AuthRequest, res: Response) => {
  if (!isStripeConfigured()) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: 'Missing webhook signature or secret' });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId },
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const sub = event.data.object as any;
        const userId = sub.metadata?.userId;
        const priceId = sub.items?.data?.[0]?.price?.id;
        const plan = priceId ? planFromPriceId(priceId) : null;
        const status = sub.status;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeSubscriptionId: sub.id,
              stripeCustomerId: sub.customer as string,
              plan: status === 'active' || status === 'trialing' ? (plan || 'pro') : 'free',
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        const userId = sub.metadata?.userId;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: 'free', stripeSubscriptionId: null },
          });
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};
