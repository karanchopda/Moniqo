const CATEGORY_MAP: { [key: string]: string[] } = {
  Food: ['swiggy', 'zomato', 'restaurant', 'bakery', 'hotel', 'eat', 'finedine', 'food', 'cafe', 'treat', 'starbucks', 'kfc', 'mcdonald', 'burger king', 'dominos', 'pizza', 'haldiram', 'barbeque', 'chai', 'tea', 'coffee'],
  Travel: ['uber', 'ola', 'rapido', 'petrol', 'shell', 'hpcl', 'bpcl', 'metro', 'irctc', 'train', 'flight', 'indigo', 'airindia', 'makemytrip', 'cleartrip', 'redbus', 'zoomcar', 'drive', 'toll', 'fastag', 'mparivahan', 'recharge-metro', 'vroom'],
  Shopping: ['amazon', 'flipkart', 'myntra', 'ajio', 'reliance', 'mall', 'store', 'h&m', 'zara', 'nike', 'adidas', 'shopping', 'nykaa', 'meesho', 'decathlon', 'shoppers stop', 'lifestyle', 'trends', 'max', 'pantaloons', 'westside', 'tanishq', 'caratlane', 'lenskart'],
  Bills: ['electricity', 'recharge', 'rent', 'airtel', 'jio', 'vodafone', 'vi ', 'bescom', 'bsnl', 'insurance', 'tata sky', 'act fibernet', 'lic', 'insurance', 'tneb', 'mseb', 'water', 'gas', 'indane', 'hpgas', 'phonepe', 'gpay', 'paytm', 'cred', 'maintenance', 'bbmp'],
  Groceries: ['blinkit', 'zepto', 'instamart', 'bigbasket', 'dmart', 'more', 'grocery', 'milk', 'vegetable', 'fruit', 'reliance fresh', 'easyday', 'spencers', 'freshtohome', 'licious', 'country delight'],
  Entertainment: ['netflix', 'hotstar', 'prime video', 'spotify', 'pvr', 'inox', 'bookmyshow', 'disney', 'youtube premium', 'gaana', 'jiosaavn', 'multiplex', 'miraj', 'carnival', 'cinepolis'],
  Lifestyle: ['cult.fit', 'gym', 'salon', 'spa', 'health', 'nykaa', 'urban company', 'vlc', 'naturals', 'vlcc', 'kayaskin', 'enrich'],
  Investment: ['zerodha', 'groww', 'upstox', 'smallcase', 'mutual fund', 'sip', 'dividend', 'kuvera', 'indmoney', 'angel broking', 'etmoney', 'wazirx', 'coin-switch', 'binance', 'mf-'],
  Medical: ['pharmacy', 'medical', 'hospital', 'appolo', '1mg', 'diagnostic', 'clinic', 'doctor', 'medplus', 'apollo', 'pharmeasy', 'netmeds', 'healthians', 'practo', 'care hospital', 'max health'],
  Transfer: ['imps-', 'neft-', 'rtgs-', 'upi-transfer', 'own a/c', 'self transfer', 'to bank', 'from bank', 'wallet', 'paytm wallet', 'mobikwik', 'cred', 'internal transfer', 'to card', 'tfr', 'trf', 'transfer', 'linked a/c', 'sweep', 'mod-'],
  Income: ['salary', 'allowance', 'bonus', 'dividend', 'interest', 'refund', 'cashback', 'credit interest', 'int.rec', 'pay-in', 'funds-in'],
};

import { moniqoBrain } from '../services/localClassifier';

export const categorizeTransaction = (description: string, type: 'credit' | 'debit'): string => {
  const desc = description.toLowerCase();
  
  // 1. QUALITY GUARD: If description is too short or looks like a date/number, treat as Others
  const alphaChars = desc.replace(/[^a-z]/g, '');
  if (desc.length < 5 || alphaChars.length < 3) {
    return 'Others';
  }

  // 2. FAST-PATH: NLP Prediction
  const prediction = moniqoBrain.predict(description);
  
  // 2. DIRECTIONAL REFINEMENT
  // If it's a credit but NLP guessed a merchant category, force it toward Income or Transfer
  if (type === 'credit') {
    if (!['Income', 'Transfer'].includes(prediction.label)) {
      // Check if it's a refund (Zomato refund, etc.)
      if (desc.includes('refund') || desc.includes('cashback')) return 'Income';
      return 'Income'; // Default for credits that don't match merchant patterns
    }
    return prediction.label;
  }

  // If it's a debit but NLP guessed Income, treat as Others or try to find a merchant
  if (type === 'debit' && prediction.label === 'Income') {
    return 'Others';
  }

  // 3. FINAL DECISION: Trust NLP if confidence is high, otherwise fallback to keyword check
  if (prediction.confidence > 0.4) {
    return prediction.label;
  }

  // Legacy Keyword Fallback for edge cases
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(keyword => desc.includes(keyword))) {
      return category;
    }
  }
  
  return 'Others';
};
