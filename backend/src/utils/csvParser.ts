import csv from 'csv-parser';
import { Readable } from 'stream';

export interface ParsedTransaction {
  date: Date;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  balance?: number;
}

export const parseCSV = (buffer: Buffer): Promise<ParsedTransaction[]> => {
  return new Promise((resolve, reject) => {
    const transactions: ParsedTransaction[] = [];
    const fullText = buffer.toString();
    const lines = fullText.split(/\r?\n/);
    
    // --- Deep Discovery: Find the actual header line ---
    let headerIdx = 0;
    const headerKeywords = [/date/i, /desc|parti|narr/i, /amount|debit|credit|value|txn/i];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const matchCount = headerKeywords.filter(regex => regex.test(line)).length;
        if (matchCount >= 2) { // Found something that looks like a header (at least 2 matches)
            headerIdx = i;
            console.log(`[csvParser] Deep Discovery: Found likely header on line ${i + 1}: ${line}`);
            break;
        }
    }

    const discoveredCSV = lines.slice(headerIdx).join('\n');
    let headersLogged = false;

    Readable.from(discoveredCSV)
      .pipe(csv())
      .on('data', (row) => {
        if (!headersLogged) {
            console.log('[csvParser] Effective headers:', Object.keys(row));
            headersLogged = true;
        }

        const keys = Object.keys(row);
        const dateKey = keys.find(k => /date|tran|period|time/i.test(k));
        const dateStr = dateKey ? row[dateKey] : null;

        if (!dateStr || dateStr.toLowerCase().includes('total')) return;

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;

        const descKey = keys.find(k => /desc|parti|narr|detail|rem/i.test(k));
        const description = (descKey ? row[descKey] : '') || 'Bank Transaction';

        // Robust Multi-Column & Type Detection
        const debitKey = keys.find(k => /debit|withdrawal|payment/i.test(k));
        const creditKey = keys.find(k => /credit|deposit|receipt/i.test(k));
        // Find amount column, strictly excluding reference numbers or IDs
        const amountKey = keys.find(k => /amount|value|txn/i.test(k) && !/ref|no|id|chq|cheque/i.test(k));
        const typeKey = keys.find(k => /type|tlr|indicator|d\/c|cr\/dr/i.test(k));
        const balKey = keys.find(k => /bal|balance|clear|closing/i.test(k));

        let amount = 0;
        let type: 'debit' | 'credit' = 'debit';

        // 1. Check for dedicated Credit column
        if (creditKey && row[creditKey]) {
            const val = parseFloat(row[creditKey].toString().replace(/[^0-9.]/g, ''));
            if (!isNaN(val) && val > 0) {
                amount = val;
                type = 'credit';
            }
        } 
        
        // 2. Check for dedicated Debit column if not a credit
        if (amount === 0 && debitKey && row[debitKey]) {
            const val = parseFloat(row[debitKey].toString().replace(/[^0-9.]/g, ''));
            if (!isNaN(val) && val > 0) {
                amount = val;
                type = 'debit';
            }
        }

        // 3. Fallback for single "Amount" column with "Type" indicator
        if (amount === 0 && amountKey && row[amountKey]) {
            amount = Math.abs(parseFloat(row[amountKey].toString().replace(/[^0-9.]/g, '')));
            
            if (typeKey && row[typeKey]) {
                const indicator = row[typeKey].toString().trim().toUpperCase();
                if (['C', 'CR', 'CREDIT', 'DEP', 'RECEIPT'].some(kw => indicator.includes(kw))) {
                    type = 'credit';
                }
            }
        }

        const balance = balKey ? parseFloat(row[balKey].toString().replace(/,/g, '')) : undefined;

        if (amount > 0) {
          transactions.push({ 
            date, 
            description: typeof description === 'string' ? description.trim() : 'Bank Transaction', 
            amount: Math.abs(amount), 
            type,
            balance
          });
        }
      })
      .on('end', () => resolve(transactions))
      .on('error', (err) => reject(err));
  });
};
