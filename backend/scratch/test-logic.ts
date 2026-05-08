// targeted test for the date/amount extraction logic
const DATE_PATTERNS = [
  /(\d{1,2}\s*[\/\-]\s*\d{1,2}\s*[\/\-]\s*\d{2,4})/,
  /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i,
  /(\d{1,2}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*-\d{2,4})/i,
  /(\d{4}-\d{1,2}-\d{1,2})/,
  /(\d{1,2}\.\d{1,2}\.\d{2,4})/,
  /(\b\d{8}\b)/, // Compact DDMMYYYY
];

const AMOUNT_REGEX = /\b(\d{1,3}(?:,\d{2,3})*(?:\.\d{1,2})?|\d{1,}(?:\.\d{1,2})?)\b/g;

function testExtraction(fullText: string) {
    const transactions: any[] = [];
    const lines = fullText.split('\n');

    // --- Layer 1 ---
    for (const line of lines) {
        if (!line.trim()) continue;
        let dateMatch = null;
        for (const pattern of DATE_PATTERNS) {
            dateMatch = line.match(pattern);
            if (dateMatch) break;
        }
        if (!dateMatch) continue;
        const dateIdx = line.indexOf(dateMatch[0]);
        const lineAfterDate = line.substring(dateIdx + dateMatch[0].length);
        const amountsFound = lineAfterDate.match(AMOUNT_REGEX);
        if (!amountsFound || amountsFound.length < 1) continue;
        const amountStr = amountsFound.length >= 2 ? amountsFound[amountsFound.length - 2] : amountsFound[0];
        const amount = parseFloat(amountStr.replace(/,/g, ''));
        if (amount > 0) {
            transactions.push({ date: dateMatch[0], amount, layer: 1 });
        }
    }

    // --- Layer 2 ---
    if (transactions.length === 0) {
        console.log('Layer 1 failed, starting Layer 2...');
        for (const pattern of DATE_PATTERNS) {
            const globalPattern = new RegExp(pattern.source, pattern.flags + 'g');
            let match;
            while ((match = globalPattern.exec(fullText)) !== null) {
                const dateStr = match[0];
                const lookahead = fullText.substring(match.index, match.index + 150);
                const amountsFound = lookahead.match(AMOUNT_REGEX);
                if (amountsFound && amountsFound.length > 0) {
                    const amount = parseFloat(amountsFound[0].replace(/,/g, ''));
                    if (amount > 0) {
                        transactions.push({ date: dateStr, amount, layer: 2 });
                    }
                }
            }
        }
    }
    return transactions;
}

const messyText = `
  10/05/2023 PURCHASE STORE 567.89 10023.45
  22-06-2023 ONLINE 1200.00 8823.45 15 JUL 2023 REFUND 450.00
  20.08.2023 COFFEE 150.00
`;

console.log('Results:', testExtraction(messyText));
