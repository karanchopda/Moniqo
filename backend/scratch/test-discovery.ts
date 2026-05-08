// Test for CSV Deep Discovery
const headerKeywords = [/date/i, /desc|parti|narr/i, /amount|debit|credit|value|txn/i];

function discoverHeader(fullText: string) {
    const lines = fullText.split(/\r?\n/);
    let headerIdx = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const matchCount = headerKeywords.filter(regex => regex.test(line)).length;
        if (matchCount >= 2) {
            headerIdx = i;
            console.log(`Found likely header on line ${i + 1}: ${line}`);
            break;
        }
    }
    return lines.slice(headerIdx).join('\n');
}

const dirtyCSV = `
Account Summary
Name: Karan Chopra
Date Range: 2023-01-01 to 2023-12-31

Tran Date,Particulars,Amount,Balance
10/01/2023,Purchase A,100.00,500.00
11/01/2023,Purchase B,50.00,450.00
`;

console.log('Resulting CSV for parsing:');
console.log(discoverHeader(dirtyCSV));
