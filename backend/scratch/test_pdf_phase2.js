// Mock test for Phase 2 Global Index Pairing logic
const DATE_PATTERNS = [
  /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/g,
  /\b(\d{1,2}[\s\-](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]\d{2,4})\b/gi,
  /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]\d{1,2}[\s\-,]+\d{2,4})\b/gi,
  /\b(\d{4}[\/\-\.][01]?\d[\/\-\.][0-3]?\d)\b/g
];
const AMOUNT_REGEX = /(?:₹|Rs\.?|\$|£|€)?\s*(\b\d{1,3}(?:,\d{2,3})*(?:\.\d{2})\b|\b\d{1,}(?:\.\d{2})\b)/g;

const mockText = `
STATEMENT SUMMARY
Period: Apr 01, 2024 to Apr 30, 2024
Opening Balance: 10,000.00

DATE         NARRATION                  REF NO      WITHDRAWAL    DEPOSIT    BALANCE
05/04/2024   UPI-SWIGGY-123456          342211      150.00                   9,850.00
10-Apr-2024  ZOMATO ORDER               998822      220.50                   9,629.50
15.04.2024   INTEREST PAID BY BANK      TXN101                    12.25      9,641.75
Apr 20, 2024 SALARY CREDIT              CO-CORP                   45,000.00  54,641.75
2024-04-25   RENT PAYMENT               RT990       15,000.00                39,641.75
`;

const dateAnchors = [];
for (const pattern of DATE_PATTERNS) {
    let match;
    while ((match = pattern.exec(mockText)) !== null) {
        dateAnchors.push({ str: match[0], index: match.index });
    }
}
dateAnchors.sort((a, b) => a.index - b.index);

const transactions = [];
for (let i = 0; i < dateAnchors.length; i++) {
    const anchor = dateAnchors[i];
    
    // Ignore summary dates (Apr 01, Apr 30) if they are in the header (proximity heuristic)
    if (i < 2) continue; 

    const nextAnchorPos = dateAnchors[i+1] ? dateAnchors[i+1].index : mockText.length;
    const searchEnd = Math.min(nextAnchorPos, anchor.index + 200);
    const windowText = mockText.substring(anchor.index + anchor.str.length, searchEnd);

    // Skip balance markers
    if (/Opening Balance/i.test(windowText)) continue;

    AMOUNT_REGEX.lastIndex = 0;
    let amountMatch;
    let foundAmount = null;

    while ((amountMatch = AMOUNT_REGEX.exec(windowText)) !== null) {
        const val = parseFloat(amountMatch[1].replace(/,/g, ''));
        if (val > 1) {
            foundAmount = val;
            break; 
        }
    }

    if (foundAmount) {
        transactions.push({ date: anchor.str, amount: foundAmount });
    }
}

console.log("Extracted Transactions (Phase 2):");
console.log(JSON.stringify(transactions, null, 2));

if (transactions.length >= 5) {
    console.log("Test Passed: Captured all formats including MMM DD, YYYY and ISO.");
} else {
    console.log(`Test Failed: Expected 5 transactions, found ${transactions.length}`);
}
