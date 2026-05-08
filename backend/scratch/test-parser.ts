import { parsePDF } from '../src/utils/pdfParser';

async function test() {
  try {
    // Simulating a messy PDF where rows are mixed or missing newlines
    const messyText = `
      Statement for 2023
      Some header info 12345
      10/05/2023 PURCHASE AT STORE 567.89 10023.45
      22-06-2023 ONLINE TRANSFER 1200.00 8823.45 15 JUL 2023 REFUND 450.00
      NO_NEWLINE_HERE 20.08.2023 COFFEE 150.00
    `;
    const result = await parsePDF(Buffer.from(messyText));
    console.log('Test Result:', result);
    
    if (result.length >= 4) {
        console.log('SUCCESS: Extracted multiple transactions from messy text.');
    } else {
        console.error('FAILURE: Could not extract enough transactions.');
    }
  } catch (err) {
    console.error('Test Error:', err);
  }
}

test();
