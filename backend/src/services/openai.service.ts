import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIAnalysisResult {
  summary: string;
  keyFindings: string[];
  moneyLeak: string;
  actions: string[];
  leaks: { name: string; instances: string; amount: number; icon: string }[];
  confidence: number; // 0 to 100
}

export const generateAIInsights = async (
  totalSpent: number,
  categoryBreakdown: any,
  totalIncome: number = 0,
  dailyAverageSpend: number = 0,
  transactions: any[] = [],
  totalTransferred: number = 0
): Promise<AIAnalysisResult> => {
  const fallback: AIAnalysisResult = {
    summary: "Audit results pending.",
    keyFindings: ["Data ingestion complete."],
    moneyLeak: "No significant waste identified yet.",
    actions: ["Review spending categories."],
    leaks: [],
    confidence: 0
  };

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-...') {
    return fallback;
  }

  // Slice top 80 transactions (or specific notable ones) to provide context without exceeding token limits
  const recentTransactions = transactions
    .filter(t => t.type === 'debit')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 80)
    .map(t => {
      const dt = typeof t.date === 'string' ? t.date : t.date?.toISOString()?.split('T')[0] || 'Unknown Date';
      // Redact PII (mask numeric IDs/Account numbers)
      const redactedDesc = t.description.replace(/\d{4,}/g, '****');
      return `${dt} | ${redactedDesc} | ₹${t.amount.toFixed(0)} | ${t.category}`;
    })
    .join('\n');

  const prompt = `
    You are a world-class financial auditor specialized in Indian retail banking data. 
    Analyze the following structured data and provide a high-precision audit report.

    CONTEXT:
    - Total Income: ₹${totalIncome.toFixed(0)} (Pure external income)
    - Total Spent: ₹${totalSpent.toFixed(0)} (Pure external expenses)
    - Total Internal Transfers: ₹${totalTransferred.toFixed(0)} (Money moving between user's own accounts/wallets - IGNORE THESE for waste analysis)
    - Daily Average external Spend: ₹${dailyAverageSpend.toFixed(0)}
    - Category Breakdown (JSON): ${JSON.stringify(categoryBreakdown)}
    
    HIGH-VALUE TRANSACTIONS (Top 80):
    ${recentTransactions || "No specific transactions provided."}

    AUDIT OBJECTIVES:
    1. EXPOSE RECURRING WASTE: Look for high-frequency micro-transactions (₹100-500) that drain capital (e.g. food apps, ride-hailing).
    2. SUBSCRIPTION AUDIT: Identify exact recurring amounts that look like subscriptions (Netflix, Spotify, SaaS tools, Gym).
    3. CAPITAL VELOCITY: Analyze the 'Burn Rate' (Daily average vs Income). If the user is spending >70% of income, be extremely critical.
    4. VENDOR AGGREGATION: Group transactions from the same vendor (e.g. all Swiggy, all Amazon) even if IDs in descriptions differ. Mention the TOTAL monthly spend for the top offending vendor.
    5. STRATEGIC REALLOCATION: For every ₹1,000 found in waste, suggest exactly where to invest it (e.g. Nifty 50 Index, Liquid Funds).
    6. FINANCIAL HEALTH SCORE: Assign a score (0-100) based on the Savings Rate [(Income-Expenses)/Income].

    OUTPUT FORMAT (Strict JSON):
    {
      "summary": "Elite, 1-line verdict on financial health (e.g., 'Capital leakage in lifestyle categories is suppressing your wealth growth by 12%').",
      "keyFindings": ["Specific data-driven finding 1", "Specific data-driven finding 2"],
      "moneyLeak": "Detailed audit of the biggest 'sinkhole'. Name the vendor, the frequency, and the total damage.",
      "actions": ["Aggressive control 1 (e.g., 'Cut Swiggy frequency by 50%')", "Investment move (e.g., 'Move ₹5k leaked from Others to an SIP')"],
      "leaks": [
        { "name": "Vendor/Category", "instances": "X times/mo", "amount": 0, "icon": "restaurant|shopping_bag|directions_car|movie|bolt|home|heart_pulse|savings" }
      ],
      "confidence": 0-100
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are an elite Indian financial analyst. You must analyze the user's spending habits rigorously. You output structured JSON." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const data = JSON.parse(response.choices[0].message.content || "{}");
    return {
      summary: data.summary || fallback.summary,
      keyFindings: data.keyFindings || fallback.keyFindings,
      moneyLeak: data.moneyLeak || fallback.moneyLeak,
      actions: data.actions || fallback.actions,
      leaks: data.leaks || [],
      confidence: data.confidence || 0,
    };
  } catch (error) {
    console.error('OpenAI Error:', error);
    return fallback;
  }
};
