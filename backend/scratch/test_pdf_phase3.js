// Mock test for Phase 3 Liberal Extraction logic
const DATE_PATTERNS = [
  /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g,
  /(\d{1,2}[\s\-](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]\d{2,4})/gi,
  /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]\d{1,2}[\s\-,]+\d{2,4})/gi,
  /(\d{4}[\/\-\.][01]?\d[\/\-\.][0-3]?\d)/g
];
const AMOUNT_REGEX = /(?:₹|Rs\.?|\$|£|€)?\s*(\d{1,3}(?:,\d{2,3})*(?:\.\d{2})|\d{1,}(?:\.\d{2}))/g;

const mockText = `
DATE:13/04/2024 NARR:UPI-FOOD-PAYMENT AMT:150.00
TRANS_ON:14-Apr-24 BY_ZOMATO CHARGE:220.50
DATE.15.04.2024.CASH.DEP.100.00.BAL.500.00
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
    const nextAnchorPos = dateAnchors[i+1] ? dateAnchors[i+1].index : mockText.length;
    const searchEnd = Math.min(nextAnchorPos, anchor.index + 200);
    const windowText = mockText.substring(anchor.index + anchor.str.length, searchEnd);

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

console.log("Extracted Transactions (Phase 3 Liberal):");
console.log(JSON.stringify(transactions, null, 2));

if (transactions.length >= 3) {
    console.log("Test Passed: Captured dates even within concatenated strings.");
} else {
    console.log(`Test Failed: Expected 3 transactions, found ${transactions.length}`);
}
