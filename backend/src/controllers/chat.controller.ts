import { Request, Response } from 'express';
import OpenAI from 'openai';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getCoachResponse = async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    console.log(`[coachController] Received message from user ${userId}: "${message}"`);

    // Fetch the latest report to provide context
    const latestReport = await prisma.report.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (latestReport) {
      console.log(`[coachController] Found report for user ${userId}. Total spent: ₹${latestReport.totalSpent}`);
    } else {
      console.log(`[coachController] No report found for user ${userId}. Prompting for data.`);
    }

    if (!latestReport) {
      return res.json({ 
        reply: "I don't have enough financial data yet to coach you properly. Please upload your bank statement first, and then I can give you personalized advice." 
      });
    }

    // Fetch the latest top 60 transactions explicitly to inject into the bot's memory context
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 60,
    });

    const transactionContext = recentTransactions.map((t: { date: Date | string; description: string; amount: { toFixed: (n: number) => string }; category: string; type: string }) => {
      const dt = typeof t.date === 'string' ? t.date : t.date?.toISOString()?.split('T')[0] || 'Unknown Date';
      return `${dt} | ${t.description} | ₹${t.amount.toFixed(0)} | ${t.category} | ${t.type.toUpperCase()}`;
    }).join('\n');

    const context = `
      User Financial Context:
      - Total Spent: ₹${latestReport.totalSpent}
      - Category Breakdown: ${JSON.stringify(latestReport.categoryBreakdown)}
      
      Recent Transactions (Max 60):
      ${transactionContext || "No distinct transactions found."}
      
      User Question: ${message}
      
      Instructions:
      You are an ELITE AI Wealth Mentor for high-potential Indian professionals. Your tone is direct, data-heavy, and sophisticated.
      Analyze the user's question by cross-referencing their 'Latest Report' summary with the 'Raw 60 Transactions' provided.
      
      CORE CAPABILITIES:
      1. MATHEMATICAL AUDIT: If the user asks about a vendor, scan the 60 transactions, sum the exact amounts, and give the precise total.
      2. ANOMALY DETECTION: Point out if a recent transaction (last 7 days) looks suspicious or represents a 'Money Leak' based on their typical category spend.
      3. CAPITAL ALLOCATION: If they ask about saving or investing, calculate their current 'Liquid Surplus' (Income - Expenses) and suggest an aggressive reallocation.
      4. ZERO FLUFF: Under 100 words. Bold key figures. Use ₹. No generic advice.
      
      If you don't have the data to answer a specific question, state: "My sensors don't detect that specific transaction in your recent 60-day window."
    `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Upgraded to gpt-4o for robust transaction mathematics and logic
        messages: [
          { role: "system", content: "You are an elite AI Money Coach for high-potential Indian professionals." },
          { role: "user", content: context }
        ],
        max_tokens: 300,
      });

      console.log(`[coachController] OpenAI response received for user ${userId}`);

      const reply = response.choices[0].message.content || "My apologies, I am momentarily unavailable to audit that request.";

      res.json({ reply });
  } catch (error: any) {
    console.error('Coach Error:', error);
    res.status(500).json({ error: error.message });
  }
};
