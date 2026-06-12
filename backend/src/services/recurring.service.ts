import prisma from '../config/prisma';

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' | 'irregular';

export interface RecurringItem {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  frequency: RecurringFrequency;
  monthlyCost: number;
  annualCost: number;
  occurrences: number;
  lastDate: string;
  nextEstimatedDate: string | null;
  source: 'pattern' | 'ai';
  impact: 'high' | 'medium' | 'low';
}

const SUBSCRIPTION_KEYWORDS = [
  'netflix', 'spotify', 'amazon prime', 'hotstar', 'youtube', 'apple', 'google',
  'microsoft', 'adobe', 'notion', 'slack', 'zoom', 'gym', 'fitness', 'subscription',
  'membership', 'premium', 'saas', 'hosting', 'domain', 'icloud', 'canva',
];

function normalizeVendor(description: string): string {
  let v = description.toLowerCase();
  v = v.replace(/\d{4,}/g, '');
  v = v.replace(/[^a-z\s]/g, ' ');
  v = v.replace(/\s+/g, ' ').trim();
  // Take first meaningful token cluster
  const words = v.split(' ').filter((w) => w.length > 2);
  return words.slice(0, 3).join(' ') || description.slice(0, 30);
}

function amountsSimilar(a: number, b: number, tolerance = 0.08): boolean {
  const avg = (a + b) / 2;
  return Math.abs(a - b) / avg <= tolerance;
}

function detectFrequency(dayGaps: number[]): RecurringFrequency {
  const avg = dayGaps.reduce((s, g) => s + g, 0) / dayGaps.length;
  if (avg >= 5 && avg <= 9) return 'weekly';
  if (avg >= 12 && avg <= 16) return 'biweekly';
  if (avg >= 25 && avg <= 35) return 'monthly';
  if (avg >= 85 && avg <= 95) return 'quarterly';
  if (avg >= 350 && avg <= 380) return 'yearly';
  return 'irregular';
}

function monthlyMultiplier(freq: RecurringFrequency): number {
  switch (freq) {
    case 'weekly': return 4.33;
    case 'biweekly': return 2.17;
    case 'monthly': return 1;
    case 'quarterly': return 1 / 3;
    case 'yearly': return 1 / 12;
    default: return 1;
  }
}

function impactFromMonthlyCost(monthly: number): 'high' | 'medium' | 'low' {
  if (monthly >= 500) return 'high';
  if (monthly >= 200) return 'medium';
  return 'low';
}

function estimateNextDate(lastDate: Date, freq: RecurringFrequency): string | null {
  const next = new Date(lastDate);
  switch (freq) {
    case 'weekly': next.setDate(next.getDate() + 7); break;
    case 'biweekly': next.setDate(next.getDate() + 14); break;
    case 'monthly': next.setMonth(next.getMonth() + 1); break;
    case 'quarterly': next.setMonth(next.getMonth() + 3); break;
    case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
    default: return null;
  }
  return next.toISOString();
}

function detectFromTransactions(transactions: { date: Date; description: string; amount: number; category: string }[]): RecurringItem[] {
  const debits = transactions.filter((t) => t.amount > 0);
  const groups = new Map<string, typeof debits>();

  for (const tx of debits) {
    const key = normalizeVendor(tx.description);
    if (!key) continue;
    const list = groups.get(key) || [];
    list.push(tx);
    groups.set(key, list);
  }

  const results: RecurringItem[] = [];

  for (const [vendor, txs] of groups) {
    if (txs.length < 2) continue;

    // Cluster by similar amounts
    const sorted = [...txs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const avgAmount = sorted.reduce((s, t) => s + t.amount, 0) / sorted.length;
    const cluster = sorted.filter((t) => amountsSimilar(t.amount, avgAmount));

    if (cluster.length < 2) continue;

    const dates = cluster.map((t) => new Date(t.date).getTime()).sort((a, b) => a - b);
    const gaps: number[] = [];
    for (let i = 1; i < dates.length; i++) {
      gaps.push((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24));
    }

    const frequency = detectFrequency(gaps);
    const amount = Math.round(avgAmount);
    const monthlyCost = Math.round(amount * monthlyMultiplier(frequency));
    const lastTx = cluster[cluster.length - 1];
    const isSubscription = SUBSCRIPTION_KEYWORDS.some((kw) => vendor.includes(kw) || lastTx.description.toLowerCase().includes(kw));

    // Require regular interval OR subscription keyword
    if (frequency === 'irregular' && !isSubscription) continue;

    results.push({
      id: `pattern-${vendor.replace(/\s/g, '-')}`,
      vendor: vendor.charAt(0).toUpperCase() + vendor.slice(1),
      category: lastTx.category,
      amount,
      frequency,
      monthlyCost,
      annualCost: monthlyCost * 12,
      occurrences: cluster.length,
      lastDate: new Date(lastTx.date).toISOString(),
      nextEstimatedDate: estimateNextDate(new Date(lastTx.date), frequency),
      source: 'pattern',
      impact: impactFromMonthlyCost(monthlyCost),
    });
  }

  return results.sort((a, b) => b.monthlyCost - a.monthlyCost);
}

function detectFromAiLeaks(leaks: unknown): RecurringItem[] {
  if (!Array.isArray(leaks)) return [];

  return leaks.map((leak: any, i: number) => {
    const amount = Number(leak.amount) || 0;
    const monthlyCost = amount;
    return {
      id: `ai-${i}`,
      vendor: leak.title || 'Unknown',
      category: 'Others',
      amount,
      frequency: 'monthly' as RecurringFrequency,
      monthlyCost,
      annualCost: monthlyCost * 12,
      occurrences: 1,
      lastDate: new Date().toISOString(),
      nextEstimatedDate: null,
      source: 'ai' as const,
      impact: (leak.impact as 'high' | 'medium' | 'low') || impactFromMonthlyCost(monthlyCost),
    };
  });
}

export async function getRecurringItems(userId: string): Promise<{
  items: RecurringItem[];
  totalMonthly: number;
  totalAnnual: number;
}> {
  const [transactions, latestReport] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId, type: 'debit', category: { not: 'Transfer' } },
      orderBy: { date: 'desc' },
      take: 500,
    }),
    prisma.report.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const patternItems = detectFromTransactions(transactions);
  const aiItems = detectFromAiLeaks(latestReport?.leaks);

  // Merge: prefer pattern detection, add AI items not already covered
  const seen = new Set(patternItems.map((i) => i.vendor.toLowerCase()));
  const merged = [...patternItems];
  for (const ai of aiItems) {
    const key = ai.vendor.toLowerCase().slice(0, 20);
    if (!seen.has(key)) {
      merged.push(ai);
      seen.add(key);
    }
  }

  const totalMonthly = merged.reduce((s, i) => s + i.monthlyCost, 0);
  return {
    items: merged.sort((a, b) => b.monthlyCost - a.monthlyCost),
    totalMonthly,
    totalAnnual: totalMonthly * 12,
  };
}
