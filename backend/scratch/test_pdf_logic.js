// Mock test for regex logic in pdfParser
const DATE_REGEX = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})|(\d{1,2}[\s\-](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]\d{2,4})/i;
const AMOUNT_REGEX = /\b(\d{1,3}(?:,\d{2,3})*(?:\.\d{1,2})?|\d{1,}(?:\.\d{1,2})?)\b/g;

const mockLines = [
    "Date         Description                Debit      Credit     Balance",
    "13/04/2024   UPI-SWIGGY-12345           150.00                2500.00",
    "14-Apr-2024  ZOMATO ORDER               220.50                2279.50",
    "15-04-2024   RENT PAYMENT",
    "             BANK TRANSFER              15000.00              -12720.50",
    "Closing Balance as of 16/04/2024                              12000.00"
];

const transactions = [];

for (let i = 0; i < mockLines.length; i++) {
    const line = mockLines[i].trim();
    if (!line) continue;

    const dateMatch = line.match(DATE_REGEX);
    if (!dateMatch) continue;

    const dateStr = dateMatch[0];
    if (/closing/i.test(line) || /balance/i.test(line)) {
        console.log(`Skipping summary line: ${line}`);
        continue;
    }

    let amount = null;
    for (let j = 0; j <= 2; j++) {
        const currentIdx = i + j;
        if (currentIdx >= mockLines.length) break;
        
        const targetLine = mockLines[currentIdx];
        const lineForAmountMatch = (j === 0) ? targetLine.replace(dateStr, '') : targetLine;
        const amounts = lineForAmountMatch.match(AMOUNT_REGEX);
        
        if (amounts && amounts.length > 0) {
            const validAmounts = amounts
                .map(a => parseFloat(a.replace(/,/g, '')))
                .filter(val => val > 1 && val < 50000); 

            if (validAmounts.length > 0) {
                // Usually take the one before balance, or the only one
                amount = validAmounts.length >= 2 ? validAmounts[validAmounts.length - 2] : validAmounts[0];
                break;
            }
        }
    }

    if (amount) {
        transactions.push({ dateStr, amount });
    }
}

console.log("Extracted Transactions:");
console.log(JSON.stringify(transactions, null, 2));

if (transactions.length >= 3) {
    console.log("Test Passed: Captured multi-line and standard formats.");
} else {
    console.log("Test Failed: Expected 3 transactions.");
}
