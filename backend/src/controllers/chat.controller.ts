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
Latest Report Summary:
- Total Spent: ₹${latestReport.totalSpent}
- Daily Average: ₹${latestReport.dailyAverage}
- Monthly Projection: ₹${latestReport.monthlyProjection}
- Category Breakdown: ${JSON.stringify(latestReport.categoryBreakdown)}

Retrieved Transactions from Statement Ledger:
${transactionContext || "No transactions found."}

User's Message: "${message}"
`;

    const systemPrompt = `You are Moniqo's Elite AI Money Coach and Wealth Mentor. You help high-potential professionals optimize their capital allocation, identify money leaks, and build long-term wealth.

Your tone should be professional, insightful, warm, and highly analytical.

CORE CAPABILITIES & CONTEXTUAL HANDLING:
1. GENERAL INQUIRIES & CONVERSATION:
   - If the user greets you (e.g., "Hi", "Hello") or asks what you can do, reply with a warm, professional greeting and briefly introduce your capabilities (e.g., statement audit, leak detection, category analysis, investment coaching).
   - If the user asks general financial questions (e.g., "How can I start saving?", "What is a good budget rule?"), provide actionable, structured advice using standard principles (e.g., the 50/30/20 rule, emergency funds, aggressive wealth building).

2. DATA-SPECIFIC INQUIRIES:
   - You are provided with the user's latest report summary (Total Spent, Daily Average, Category Breakdown) and a list of semantically retrieved transactions.
   - If the user asks about their spending, specific categories (e.g., "How much did I spend on Food?"), or specific vendors (e.g., "Swiggy spend"), perform a precise mathematical audit. Sum the amounts of matching transactions from the retrieved list, and state the exact total and count of transactions.
   - If they ask about a vendor or category that is NOT in the retrieved transactions list, check the context carefully. If it is indeed missing, reply politely: "I don't see any transactions for that category or vendor in the current statement ledger. You can try uploading a new statement or checking the Transactions tab." Do NOT use robotic phrases like "My sensors don't detect...".

3. ANOMALY & LEAK SCANS:
   - If they ask about money leaks, reference the identified leaks or point out high-frequency transaction categories that seem unproductive.

4. RESPONSE FORMATTING:
   - Keep responses concise but complete and thorough (aim for 100-250 words).
   - Use bold formatting for key figures, amounts, and dates (e.g., **₹12,450**).
   - Always display currency in Indian Rupees (₹).
   - Structure your answers with clear spacing or bullet points for readability.`;

    let reply = "";
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Upgraded to gpt-4o for robust transaction mathematics and logic
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: context }
        ],
        max_tokens: 400,
      });

      console.log(`[coachController] OpenAI response received for user ${userId}`);
      reply = response.choices[0].message.content || "My apologies, I am momentarily unable to audit that request.";
    } catch (apiError: any) {
      console.warn("[coachController] OpenAI API error (most likely quota limit), executing premium fallback engine:", apiError.message);
      
      const lowercaseMsg = message.toLowerCase();
      
      if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi") || lowercaseMsg.includes("hey") || lowercaseMsg.includes("who are you") || lowercaseMsg.includes("help") || lowercaseMsg.includes("welcome")) {
        reply = `Hello! I am your **Moniqo Wealth Coach**. 

I analyze your financial statement to optimize capital allocation and spot money leaks. Here is what you can ask me:
* **Vendor Audits**: *"How much did I spend on Swiggy?"* or *"Track my Uber spends."*
* **Leak Detection**: *"Show me my biggest money leaks."*
* **Budget Blueprint**: *"Suggest a budget plan for my expenses."*

Currently, your latest uploaded statement shows a total expenditure of **₹${latestReport.totalSpent.toLocaleString()}** with a daily average run-rate of **₹${latestReport.dailyAverage.toLocaleString()}**. Let me know how I can guide you today!`;
      } 
      else if (lowercaseMsg.includes("leak") || lowercaseMsg.includes("roast") || lowercaseMsg.includes("waste") || lowercaseMsg.includes("subscription")) {
        const leaks = (latestReport.leaks as any[]) || [];
        if (leaks.length > 0) {
          reply = `Here is an audit of your **Spending Leaks**:\n\n` + 
            leaks.map((l, idx) => `${idx + 1}. **${l.category}**: **₹${Number(l.amount).toLocaleString()}** - *"${l.reason}"*`).join("\n") +
            `\n\n**Action Plan**: Reducing these minor, high-frequency leaks will free up approximately **₹${(latestReport.totalSpent * 0.15).toLocaleString()}** per month to reallocate into high-yield investments.`;
        } else {
          reply = `My audit indicates your statement does not have significant subscription leaks. However, your **Daily Average Spend is ₹${latestReport.dailyAverage.toLocaleString()}**. Look out for micro-transactions or weekend food deliveries that accumulate quickly.`;
        }
      }
      else if (
        lowercaseMsg.includes("outflow") ||
        lowercaseMsg.includes("total spend") ||
        lowercaseMsg.includes("total outflow") ||
        lowercaseMsg.includes("total expense") ||
        lowercaseMsg.includes("how much did i spend") ||
        (lowercaseMsg.includes("spend") && !lowercaseMsg.includes("swiggy") && !lowercaseMsg.includes("zomato") && !lowercaseMsg.includes("uber") && !lowercaseMsg.includes("ola") && !lowercaseMsg.includes("amazon") && !lowercaseMsg.includes("flipkart") && !lowercaseMsg.includes("food") && !lowercaseMsg.includes("travel") && !lowercaseMsg.includes("groceries") && !lowercaseMsg.includes("dining"))
      ) {
        const debitTransactions = retrievedTransactions.filter((t: any) => 
          t.type.toLowerCase() === 'debit' && t.category !== 'Transfer'
        );
        const totalOutflow = debitTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        
        reply = `Your **Total Outflow** (direct debit expenses) across the statement period is **₹${totalOutflow.toLocaleString()}** across **${debitTransactions.length}** transactions (excluding internal transfers).\n\nYour average daily run-rate is **₹${latestReport.dailyAverage.toLocaleString()}** and your projected monthly outflow is **₹${latestReport.monthlyProjection.toLocaleString()}**.`;
      }
      else if (
        lowercaseMsg.includes("inflow") ||
        lowercaseMsg.includes("income") ||
        lowercaseMsg.includes("salary") ||
        lowercaseMsg.includes("total credit") ||
        lowercaseMsg.includes("total income")
      ) {
        const creditTransactions = retrievedTransactions.filter((t: any) => 
          t.type.toLowerCase() === 'credit' && t.category !== 'Transfer'
        );
        const totalInflow = creditTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        
        reply = `Your **Total Inflow** (credits & income) across the statement period is **₹${totalInflow.toLocaleString()}** across **${creditTransactions.length}** transactions.\n\nYour net savings rate after expenses is **₹${(totalInflow - latestReport.totalSpent).toLocaleString()}**.`;
      }
      else if (
        lowercaseMsg.includes("food") || 
        lowercaseMsg.includes("swiggy") || 
        lowercaseMsg.includes("zomato") || 
        lowercaseMsg.includes("uber") || 
        lowercaseMsg.includes("ola") || 
        lowercaseMsg.includes("amazon") || 
        lowercaseMsg.includes("flipkart") || 
        lowercaseMsg.includes("spend") || 
        lowercaseMsg.includes("transaction")
      ) {
        const keywords = ["swiggy", "zomato", "uber", "ola", "amazon", "flipkart", "food", "travel", "groceries", "dining"];
        let matchedKeyword = keywords.find(k => lowercaseMsg.includes(k)) || "";
        
        const matches = retrievedTransactions.filter((t: any) => {
          const desc = t.description.toLowerCase();
          const cat = t.category.toLowerCase();
          return matchedKeyword 
            ? (desc.includes(matchedKeyword) || cat.includes(matchedKeyword))
            : t.type.toLowerCase() === 'debit';
        });

        if (matches.length > 0) {
          const totalMatch = matches.reduce((sum, t) => sum + Number(t.amount), 0);
          reply = `Here is your transaction audit for **${matchedKeyword ? matchedKeyword.toUpperCase() : "recent debit transactions"}**:\n\n` +
            `* Total Spend: **₹${totalMatch.toLocaleString()}**\n` +
            `* Transaction Count: **${matches.length}**\n\n` +
            `**Detailed Log:**\n` +
            matches.slice(0, 5).map(m => `* **${new Date(m.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}**: ₹${m.amount} (${m.description})`).join("\n") +
            (matches.length > 5 ? `\n* ...and **${matches.length - 5}** more transactions in the ledger.` : "");
        } else {
          reply = `I audited your recent ledger transactions and could not locate entry matches for **"${matchedKeyword || "searched items"}"**. You can view full records in the **Transactions** ledger tab.`;
        }
      }
      else if (lowercaseMsg.includes("save") || lowercaseMsg.includes("invest") || lowercaseMsg.includes("budget") || lowercaseMsg.includes("surplus") || lowercaseMsg.includes("allocation")) {
        const monthlySpent = latestReport.monthlyProjection || (latestReport.totalSpent * 1.2);
        reply = `Here is your custom **Capital Allocation & Budget Blueprint** based on current spends:\n\n` +
          `* **Monthly Outflow (Projected)**: **₹${monthlySpent.toLocaleString()}**\n` +
          `* **Daily Run Rate**: **₹${latestReport.dailyAverage.toLocaleString()}**\n\n` +
          `**Wealth Creation Steps:**\n` +
          `1. **Emergency Buffer**: Maintain a liquid cash reserve of **₹${(monthlySpent * 3).toLocaleString()}**.\n` +
          `2. **Fixed Allocation**: Allocate **50%** for essential needs, **30%** for investments (SIPs/Mutual Funds), and **20%** for lifestyle spending.\n` +
          `3. **Immediate Optimization**: Review your top category spend to shave off at least **10%** from non-essentials.`;
      }
      else {
        reply = `I have analyzed your statement data. Your total spend is **₹${latestReport.totalSpent.toLocaleString()}** with a daily run-rate of **₹${latestReport.dailyAverage.toLocaleString()}**.\n\nCould you specify if you would like me to:\n* Audit a vendor (e.g., *"How much spent on Swiggy?"*)\n* Identify leaks (*"Show leaks"*)\n* Help budget (*"Budget blueprint"*)`;
      }
    }

      res.json({ reply });
  } catch (error: any) {
    console.error('Coach Error:', error);
    res.status(500).json({ error: error.message });
  }
};
