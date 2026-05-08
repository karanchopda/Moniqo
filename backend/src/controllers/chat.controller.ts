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

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Fetch the latest report to provide context
    const latestReport = await prisma.report.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

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

    const transactionContext = recentTransactions.map(t => {
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
      You are a premium, expert AI Money Coach. Your tone is luxury, direct, and elite. 
      Analyze the user's question based on their financial context and raw transaction data. 
      If they ask a specific question like "how much did I spend at vendor X", strictly calculate from the context strings efficiently.
      Keep your answer concise (under 100 words) but high-impact. 
      Use Indian currency (₹) and cultural context if appropriate.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Upgraded to gpt-4o for robust transaction mathematics and logic
      messages: [
        { role: "system", content: "You are an elite AI Money Coach for high-potential Indian professionals." },
        { role: "user", content: context }
      ],
      max_tokens: 300,
    });

    const reply = response.choices[0].message.content || "My apologies, I am momentarily unavailable to audit that request.";

    res.json({ reply });
  } catch (error: any) {
    console.error('Coach Error:', error);
    res.status(500).json({ error: error.message });
  }
};
