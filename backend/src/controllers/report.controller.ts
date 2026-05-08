import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/prisma';
import { generateAIInsights } from '../services/openai.service';

export const generateReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { statementId } = req.body;
    
    // Fetch all transactions or specific statement transactions
    const query: any = { where: { userId } };
    if (statementId) {
      query.where.statementId = statementId;
      console.log(`[reportController] Generating report for statement: ${statementId}`);
    }

    let isFallback = false;
    const transactions = await prisma.transaction.findMany(query);

    // If no transactions found for the specific statement (maybe they were all duplicates),
    // fallback to the user's latest 100 transactions so they still see a result.
    if (transactions.length === 0) {
      console.log(`[reportController] No transactions for statement ${statementId}. Falling back to global user history.`);
      isFallback = true;
      const fallbackTransactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 500
      });

      if (fallbackTransactions.length === 0) {
        return res.status(400).json({ error: 'No transactions found. Please upload a valid statement first.' });
      }
      
      transactions.push(...fallbackTransactions);
    }

    // 1. Calculate Totals (Credit vs Debit) - EXCLUDE Transfers for pure external flow analysis
    const totalIncome = transactions
      .filter(t => t.type === 'credit' && t.category !== 'Transfer')
      .reduce((acc, t) => acc + t.amount, 0);

    const expensesTransactions = transactions.filter(t => t.type === 'debit' && t.category !== 'Transfer');
    const totalSpent = expensesTransactions.reduce((acc, t) => acc + t.amount, 0);
    
    // 1b. Calculate internal flow (Transfers) for AI context
    const totalTransferred = transactions
        .filter(t => t.category === 'Transfer')
        .reduce((acc, t) => acc + t.amount, 0);

    // 2. Breakdown per category (for debates/expenses)
    const breakdown: { [key: string]: number } = {};
    expensesTransactions.forEach(t => {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    });

    // 3. Daily Average calculation
    const uniqueDays = new Set(transactions.map(t => new Date(t.date).toDateString())).size;
    const dailyAverage = totalSpent / (uniqueDays || 1);
    const monthlyProjection = dailyAverage * 30;

    // 4. Generate AI Insights with new structured requirements
    const aiAnalysis = await generateAIInsights(
      totalSpent, 
      breakdown, 
      totalIncome, 
      dailyAverage,
      transactions,
      totalTransferred
    );

    // 5. Save Report
    // We store the full structured object in aiInsights as a JSON string
    const report = await prisma.report.create({
      data: {
        userId,
        totalSpent,
        categoryBreakdown: breakdown,
        aiInsights: JSON.stringify({
          summary: aiAnalysis.summary,
          keyFindings: aiAnalysis.keyFindings,
          moneyLeak: aiAnalysis.moneyLeak,
          actions: aiAnalysis.actions,
          confidence: aiAnalysis.confidence
        }),
        leaks: aiAnalysis.leaks,
        dailyAverage,
        monthlyProjection,
      },
    });

    res.status(201).json({
      ...report,
      transactions,
      isFallback
    });
  } catch (error: any) {
    console.error('Report Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

export const getLatestReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const report = await prisma.report.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    if (!report) {
      return res.status(404).json({ error: 'No report found' });
    }
    
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};
