import { Response } from 'express';
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
    } catch (e) {
      // Fallback to default search
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

    const systemPrompt = `You are Moniqo's Elite AI Money Auditor and Capital Assessor. You analyze bank statement entries to help professionals plug money leaks and optimize capital velocity.

Your tone is strict, witty, direct, and highly analytical. Avoid soft greetings or generic pleasantries.

CORE CAPABILITIES & CONTEXTUAL HANDLING:
1. GENERAL INQUIRIES & CONVERSATION:
   - Introduce yourself directly as Moniqo's Auditor. Outline capabilities (transaction audit, leak scans, burn rate tracking, opportunity cost analysis).
   - Answer general financial queries with strict, direct principles (e.g., 50/30/20 rule, emergency funds, aggressive wealth building). Mention the cost of delay.

2. DATA-SPECIFIC INQUIRIES:
   - Sum the matching transactions exactly and present the results in bold.
   - Contrast spending with potential SIP value (e.g., "₹5,000/mo spent on delivery, which could grow to ₹9.3 Lakhs in a 10-year Nifty SIP").
   - If a vendor or category is missing, state it directly and suggest checking the ledger or uploading a statement.

3. LEAK SCANS:
   - Expose recurring waste and weekend spending spikes. Call out excessive micro-transactions.

4. RESPONSE FORMATTING:
   - Keep responses concise and focused (100-200 words).
   - Use bold formatting for key figures, amounts, and dates (e.g., **₹12,450**).
   - Always display currency in Indian Rupees (₹).
   - Use bullet points for structural readability.`;

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
      reply = response.choices[0].message.content || "I am momentarily unable to reach my semantic audit model. Please re-try in a moment.";
    } catch (apiError: any) {
      console.warn("[coachController] OpenAI API error, executing strict fallback engine:", apiError.message);
      
      const lowercaseMsg = message.toLowerCase();
      
      if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi") || lowercaseMsg.includes("hey") || lowercaseMsg.includes("who are you") || lowercaseMsg.includes("help") || lowercaseMsg.includes("welcome")) {
        reply = `I am your **Moniqo Auditor**. I perform forensic statement audits to expose where your capital is leaking.
        
Ask me direct questions like:
* **Vendor Audits**: *"How much did I spend on Swiggy?"* or *"Track my Uber spends."*
* **Leak Detection**: *"Show me my biggest money leaks."*
* **Audit Blueprint**: *"Suggest a capital plan for my expenses."*

Your latest statement audit shows direct expenses of **₹${latestReport.totalSpent.toLocaleString()}** with a daily burn rate of **₹${latestReport.dailyAverage.toLocaleString()}**. State your request to begin.`;
      } 
      else if (lowercaseMsg.includes("leak") || lowercaseMsg.includes("roast") || lowercaseMsg.includes("waste") || lowercaseMsg.includes("subscription")) {
        const leaks = (latestReport.leaks as any[]) || [];
        if (leaks.length > 0) {
          reply = `Forensic audit of your **Spending Leaks**:\n\n` + 
            leaks.map((l, idx) => `${idx + 1}. **${l.category}**: **₹${Number(l.amount).toLocaleString()}** - *"${l.reason}"*`).join("\n") +
            `\n\n**Auditor Recommendation**: Reducing these leaks immediately redirects **₹${(latestReport.totalSpent * 0.15).toLocaleString()}** per month into wealth compounding tools (e.g. mutual funds/SIPs). Stop converting salary into short-term convenience.`;
        } else {
          reply = `Your statement lacks obvious subscription sinkholes. However, your **Daily Burn Rate is ₹${latestReport.dailyAverage.toLocaleString()}**. Impulsive weekend orders and micro-payments are likely draining your account.`;
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
