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

    // 1. Semantic RAG Pre-processor: Extract search parameters from user's message
    let searchParams: { keywords?: string[]; categories?: string[]; daysLimit?: number | null } = {};
    try {
      const classifier = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a financial search classifier. Analyze the user prompt and extract search variables. Return JSON only with format: { \"keywords\": [\"Swiggy\"], \"categories\": [\"Food\"], \"daysLimit\": 30 } (set daysLimit as integer representing days to look back, or null if no time range mentioned)."
          },
          { role: "user", content: message }
        ],
        response_format: { type: "json_object" }
      });
      searchParams = JSON.parse(classifier.choices[0].message.content || '{}');
      console.log(`[coachController] Extracted semantic filters:`, searchParams);
    } catch (e) {
      console.error("[coachController] Failed to classify user prompt. Falling back to default search.", e);
    }

    const { keywords = [], categories = [], daysLimit } = searchParams;
    const whereClause: any = { userId };

    // Set time filter if requested
    if (daysLimit) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - daysLimit);
      whereClause.date = { gte: cutoff };
    }

    // Build dynamic OR query for keywords/categories
    const orConditions: any[] = [];
    if (keywords.length > 0) {
      keywords.forEach((kw: string) => {
        orConditions.push({ description: { contains: kw, mode: 'insensitive' } });
      });
    }
    if (categories.length > 0) {
      categories.forEach((cat: string) => {
        orConditions.push({ category: { contains: cat, mode: 'insensitive' } });
      });
    }

    if (orConditions.length > 0) {
      whereClause.OR = orConditions;
    }

    // 2. Fetch semantic matches across ALL history
    let retrievedTransactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: 100
    });

    // Semantic Fallback: if no specific matches found, retrieve recent 60 to maintain standard context
    if (retrievedTransactions.length === 0) {
      console.log("[coachController] Zero RAG matches. Falling back to last 60 recent transactions.");
      retrievedTransactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 60,
      });
    } else {
      console.log(`[coachController] Semantic RAG matches found: ${retrievedTransactions.length} items.`);
    }

    const transactionContext = retrievedTransactions.map((t: { date: Date | string; description: string; amount: number; category: string; type: string }) => {
      const dt = typeof t.date === 'string' ? t.date : t.date?.toISOString()?.split('T')[0] || 'Unknown Date';
      const amountVal = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount);
      return `${dt} | ${t.description} | ₹${amountVal.toFixed(0)} | ${t.category} | ${t.type.toUpperCase()}`;
    }).join('\n');

    const context = `
      User Financial Context:
      - Total Spent: ₹${latestReport.totalSpent}
      - Category Breakdown: ${JSON.stringify(latestReport.categoryBreakdown)}
      
      Retrieved Semantically Relevant Transactions:
      ${transactionContext || "No distinct transactions found."}
      
      User Question: ${message}
      
      Instructions:
      You are an ELITE AI Wealth Mentor for high-potential Indian professionals. Your tone is direct, data-heavy, and sophisticated.
      Analyze the user's question by cross-referencing their 'Latest Report' summary with the 'Retrieved Semantically Relevant Transactions' provided.
      
      CORE CAPABILITIES:
      1. MATHEMATICAL AUDIT: If the user asks about a vendor, scan the retrieved transactions, sum the exact amounts, and give the precise total.
      2. ANOMALY DETECTION: Point out if a transaction looks suspicious or represents a 'Money Leak' based on their typical category spend.
      3. CAPITAL ALLOCATION: If they ask about saving or investing, calculate their current 'Liquid Surplus' (Income - Expenses) and suggest an aggressive reallocation.
      4. ZERO FLUFF: Under 100 words. Bold key figures. Use ₹. No generic advice.
      
      If you don't have the data to answer a specific question, state: "My sensors don't detect that specific transaction in your transaction ledger."
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
