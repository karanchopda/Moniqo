import { ParsedTransaction } from './csvParser';
import { extractWithOpenAI } from './openaiOcr';

// Use the legacy build for better compatibility with Node.js environments
let pdfjs: any = null;

export const parsePDF = async (buffer: Buffer, password?: string): Promise<ParsedTransaction[]> => {
  try {
    if (!pdfjs) {
      pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
    }
    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      password: password,
      stopAtErrors: false,
      isEvalSupported: false,
      disableFontFace: true // Use system fonts if possible to avoid loading errors
    });

    const pdfDocument = await loadingTask.promise;

    let allParsedLines: { y: number, items: { x: number, str: string }[] }[] = [];
    let totalItems = 0;

    for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        
        totalItems += textContent.items.length;

        // Group items by their Y coordinate (line by line)
        const lineMap = new Map<number, { x: number, str: string }[]>();
        
        textContent.items.forEach((item: any) => {
            const x = item.transform[4];
            const y = Math.round(item.transform[5]); // Round Y to group items on the same line
            if (!lineMap.has(y)) lineMap.set(y, []);
            lineMap.get(y)!.push({ x, str: item.str });
        });

        // Convert Map to sorted array of lines (top to bottom)
        const sortedLines = Array.from(lineMap.entries())
            .sort((a, b) => b[0] - a[0]) // PDF.js Y increases upwards
            .map(([y, items]) => ({ y, items: items.sort((a, b) => a.x - b.x) }));
        
        allParsedLines.push(...sortedLines);
    }

    if (totalItems === 0) {
        console.warn('[pdfParser] SCANNED_PDF_DETECTED: No selectable text found. Delegating to OpenAI OCR engines...');
        return await extractWithOpenAI(buffer);
    }

    // --- PHASE 6: CONSENSUS-BASED HEADER DISCOVERY ---
    // Only trust a row as headers if it sees multiple financial indicators
    let colX = {
        withdrawal: 400, // Defaults
        deposit: 500,
        balance: 600
    };
    for (const line of allParsedLines.slice(0, 150)) {
        const items = line.items;
        const widItem = items.find(it => /\b(WITHDRAWAL|DEBIT|PAYMENT|DR|PARTICULARS)\b/i.test(it.str));
        const depItem = items.find(it => /\b(DEPOSIT|CREDIT|RECEIPT|CR)\b/i.test(it.str));
        const balItem = items.find(it => /\bBALANCE\b/i.test(it.str));

        // Consensus: Must find at least two major landmarks to lock in columns
        if ((widItem && depItem) || (widItem && balItem) || (depItem && balItem)) {
            if (widItem) colX.withdrawal = widItem.x;
            if (depItem) colX.deposit = depItem.x;
            if (balItem) colX.balance = balItem.x;
            break;
        }
    }

    const transactions: ParsedTransaction[] = [];
    const CREDIT_KEYWORDS = [/\bCREDIT\b/i, /\bDEPOSIT\b/i, /\bRECEIVED\b/i, /\bREFUND\b/i, /\bCR\b/i, /\bC\/R\b/i, /INT\.REC/i, /UPI-IN/i, /\+ /];
    
    // --- PHASE 7: PROXIMITY-BASED EXTRACTION ---
    const DATE_REGEX = /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})|(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})|((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]\d{1,2}(?:\s*,\s*|\s+)\d{2,4})|(\d{1,2}[\s\-](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]\d{2,4})/i;
    const AMOUNT_REGEX = /^-?\d{1,3}(?:,\d{2,3})*(?:\.\d{2})$|^\d{1,}(?:\.\d{2})$/;

    allParsedLines.forEach(line => {
        const lineStr = line.items.map(it => it.str).join(' ');
        
        // 1. Find Date Anchor
        const dateMatch = lineStr.match(DATE_REGEX);
        if (!dateMatch) return;

        const dateStr = dateMatch[0];
        const dateItem = line.items.find(it => it.str === dateStr);
        const normalizedDateStr = dateStr.replace(/[\.\-]/g, '/');
        const date = new Date(normalizedDateStr);
        if (isNaN(date.getTime())) return;

        // 2. Find all number items in this line
        const amountItems = line.items.filter(it => {
            const clean = it.str.replace(/[₹Rs\$\s,]/g, '').trim();
            const superClean = clean.replace(/CR|DR|[\+\-]/gi, '').trim();
            return AMOUNT_REGEX.test(superClean);
        });

        if (amountItems.length === 0) return;

        // 3. Narrative Extraction: Anchor to date end
        const descriptionStartX = dateItem ? dateItem.x + (dateItem.str.length * 6) + 10 : 80;
        let description = line.items
            .filter(it => it.x >= descriptionStartX && it.x < (Math.min(colX.withdrawal, colX.deposit) - 10))
            .map(it => it.str)
            .join(' ')
            .trim();

        // Narrative Recovery if empty
        if (description.length < 3) {
            description = line.items
                .filter(it => it.x > 50 && it.x < (Math.min(colX.withdrawal, colX.deposit) - 10))
                .filter(it => !DATE_REGEX.test(it.str))
                .map(it => it.str)
                .join(' ')
                .trim() || 'Bank Transaction';
        }

        // 4. Proximity-Based Type Assignment
        let amount = 0;
        let type: 'debit' | 'credit' = 'debit';
        let balance: number | undefined = undefined;
        
        // Calculate which column each amount is closest to
        amountItems.forEach(it => {
            const val = parseFloat(it.str.replace(/[^0-9.]/g, ''));
            if (val <= 0) return;

            const distToWithdrawal = Math.abs(it.x - colX.withdrawal);
            const distToDeposit = Math.abs(it.x - colX.deposit);
            const distToBalance = Math.abs(it.x - colX.balance);

            // If it's closest to the balance column, ignore it for amount (it's the balance row)
            if (distToBalance < distToWithdrawal && distToBalance < distToDeposit) {
                balance = val;
                return;
            }

            // Otherwise, pick the closest column
            if (distToDeposit < distToWithdrawal) {
                amount = val;
                type = 'credit';
            } else {
                amount = val;
                type = 'debit';
            }
        });

        // Final directional check via text signals (UPI-IN, UPI-OUT, etc.)
        const lineUpper = lineStr.toUpperCase();
        if (amount > 0 && CREDIT_KEYWORDS.some(kw => kw.test(lineUpper))) {
            type = 'credit';
        }

        if (amount > 0) {
            // --- CLEANING NARRATIVE ---
            let cleanDesc = description.trim()
                .replace(/UPI\/\d+\/([^\/]+)\/.*/i, '$1') // Extract merchant from UPI string
                .replace(/\d{10,}/g, '') // Remove long numbers (reference numbers/mobile)
                .replace(/[A-Z]{4}\d{6,}/g, '') // Remove bank transaction codes
                .replace(/\s+/g, ' ')
                .trim();
            
            // If cleaning removed too much, fallback to original but truncated
            if (cleanDesc.length < 3) cleanDesc = description.trim().substring(0, 50);

            transactions.push({
                date,
                description: cleanDesc,
                amount,
                type,
                balance
            });
        }
    });

    // If we only found a tiny number of transactions on multiple pages, it's likely a misread
    const isPoorExtraction = transactions.length < 2 && pdfDocument.numPages >= 1;

    if (transactions.length === 0 || isPoorExtraction) {
        console.warn(`[pdfParser] ${transactions.length === 0 ? 'No' : 'Insufficient (' + transactions.length + ')'} transactions found. Falling back to OpenAI OCR...`);
        return await extractWithOpenAI(buffer);
    }

    return transactions;
  } catch (error: any) {
    if (error.message === 'SCANNED_PDF_DETECTED') throw error;
    
    // PDF.js specifically uses name 'PasswordException' for locked files
    if (error.name === 'PasswordException' || error.message?.toLowerCase().includes('password')) {
        console.warn('[pdfParser] Password required/incorrect for this PDF.');
        throw new Error('PASSWORD_REQUIRED');
    }
    
    console.error('[pdfParser] Phase 5 Error:', error);
    throw error;
  }
};

