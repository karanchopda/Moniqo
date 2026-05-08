import OpenAI, { toFile } from 'openai';
import { ParsedTransaction } from './csvParser';

const openai = new OpenAI(); // uses OPENAI_API_KEY from env

const EXTRACTION_PROMPT = `You are a world-class financial data extraction engine.
You will receive a scanned bank statement (possibly an image-based PDF).
Your sole task is to extract every transaction from the document and return them as a raw JSON array.

Rules:
- Return ONLY a valid JSON array. No markdown, no code fences, no preamble.
- Each item MUST follow this exact schema:
  { "date": "YYYY-MM-DD", "description": string, "amount": number, "type": "debit"|"credit", "balance": number|null }
- Normalize all dates to ISO 8601 (YYYY-MM-DD).
- "amount" must always be a positive number.
- "type" is "credit" for money received, "debit" for money sent/withdrawn.
- "balance" is the running balance shown on that row, or null if not present.
- Skip account summaries, headers, page numbers, and opening/closing balance rows.
- If you cannot find any transactions, return an empty array: []`;

export const extractWithOpenAI = async (buffer: Buffer): Promise<ParsedTransaction[]> => {
    console.log('[openaiOcr] Starting GPT-4o Vision OCR for scanned PDF...');

    let fileId: string | null = null;

    try {
        // 1. Upload the PDF buffer directly to OpenAI
        const uploadedFile = await openai.files.create({
            file: await toFile(buffer, 'statement.pdf', { type: 'application/pdf' }),
            purpose: 'user_data', // 'user_data' is required for Chat Completions API
        });
        fileId = uploadedFile.id;
        console.log(`[openaiOcr] PDF uploaded successfully. File ID: ${fileId}`);

        // 2. Send to GPT-4o via Chat Completions — the model natively handles scanned PDFs
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: EXTRACTION_PROMPT,
                        },
                        {
                            // @ts-ignore — 'file' content type is supported in GPT-4o but not yet in the TS types
                            type: 'file',
                            file: { file_id: fileId },
                        },
                    ],
                },
            ],
            temperature: 0,     // Zero temperature = deterministic, precise output
            max_tokens: 16384,  // Enough headroom for a large statement
            response_format: { type: 'text' },
        });

        const rawText = response.choices[0]?.message?.content?.trim() ?? '';
        console.log(`[openaiOcr] Received response. Snippet: ${rawText.substring(0, 200)}`);

        // 3. Clean up any markdown fences the model may have added anyway
        const cleanJson = rawText
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/, '')
            .trim();

        try {
            const parsed: ParsedTransaction[] = JSON.parse(cleanJson);
            console.log(`[openaiOcr] Successfully extracted ${parsed.length} transactions via OCR.`);

            // Normalise dates and amounts just in case the model slipped up
            return parsed.map(t => ({
                ...t,
                date: new Date(t.date),
                amount: Math.abs(Number(t.amount)),
            })) as unknown as ParsedTransaction[];

        } catch (parseErr) {
            console.error('[openaiOcr] JSON parse failed. Raw AI response:\n', cleanJson);
            return [];
        }

    } catch (error: any) {
        console.error('[openaiOcr] Fatal OCR error:', error?.message ?? error);
        return [];
    } finally {
        // Always clean up the remote file to protect user privacy
        if (fileId) {
            await openai.files.delete(fileId!).catch((err: any) =>
                console.warn('[openaiOcr] Could not delete remote file:', err?.message)
            );
            console.log(`[openaiOcr] Cleaned up remote file ${fileId}`);
        }
    }
};
