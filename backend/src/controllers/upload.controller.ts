import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { parseCSV } from '../utils/csvParser';
import { parsePDF } from '../utils/pdfParser';
import { categorizeTransaction } from '../utils/categorizer';
import prisma from '../config/prisma';

import { uploadFile } from '../services/supabase.service';

export const uploadStatement = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received.' });
    }
    const { buffer, originalname, size, mimetype } = req.file;
    console.log(`[uploadController] Received ${originalname} (${size} bytes)`);

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'File buffer is empty.' });
    }
    const { password } = req.body;
    const userId = req.userId!;

    // Validate user exists to avoid foreign key violations
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        return res.status(401).json({ error: 'Session invalid or user not found. Please login again.' });
    }

    // 1. Upload file to Supabase Storage
    let fileUrl = '';
    try {
      const uploadResult = await uploadFile(buffer, originalname, mimetype);
      fileUrl = uploadResult.publicUrl;
      console.log(`[uploadController] File uploaded to storage: ${fileUrl}`);
    } catch (storageError: any) {
      console.error('[uploadController] Storage Error:', storageError);
      // We continue with parsing even if storage fails, or we can opt to fail here.
      // Given the user's request "first need to store", we should probably fail if storage fails.
      return res.status(500).json({ error: 'Failed to store file', details: storageError.message });
    }

    // 2. Create Statement record (PENDING)
    const statement = await prisma.statement.create({
      data: {
        userId,
        filename: originalname,
        fileUrl,
        status: 'PROCESSING'
      }
    });

    let transactionsData: any[] = [];

    try {
      if (originalname.endsWith('.csv')) {
        transactionsData = await parseCSV(buffer);
      } else if (originalname.endsWith('.pdf')) {
        try {
          transactionsData = await parsePDF(buffer, password);
        } catch (error: any) {
          if (error.message === 'PASSWORD_REQUIRED') {
            await prisma.statement.update({
              where: { id: statement.id },
              data: { status: 'FAILED' }
            });
            return res.status(401).json({ 
              error: 'Password required for this statement',
              code: 'PASSWORD_REQUIRED'
            });
          }
          throw error;
        }
      } else {
        await prisma.statement.update({
          where: { id: statement.id },
          data: { status: 'FAILED' }
        });
        return res.status(400).json({ error: 'Unsupported file format' });
      }

      // Guard: if parsing succeeded but no transactions were found
      if (transactionsData.length === 0) {
        console.warn('[uploadController] Zero transactions extracted. Saving as vault record.');
        await prisma.statement.update({
          where: { id: statement.id },
          data: { status: 'PROCESSED' }
        });
        
        return res.status(201).json({
          message: 'Zero transactions extracted. The format might be unsupported or the file is empty.',
          count: 0,
          statementId: statement.id
        });
      }

      // 3. Process and save transactions with SMART DEDUPLICATION
      const mappedTransactions = transactionsData.map((t) => ({
        userId,
        statementId: statement.id,
        date: t.date,
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: categorizeTransaction(t.description, t.type),
        balance: t.balance
      }));

      console.log(`[uploadController] Running deduplication for ${mappedTransactions.length} items...`);
      
      // We fetch existing transactions for this user within the date range of the uploaded items to optimize
      const dates = mappedTransactions.map((t: any) => new Date(t.date));
      const minDate = new Date(Math.min(...dates.map((d: Date) => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map((d: Date) => d.getTime())));

      const existingTransactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: minDate, lte: maxDate }
        },
        select: { id: true, date: true, description: true, amount: true }
      });

      // Simple hash-like key for comparison
      const makeKey = (t: any) => `${new Date(t.date).toISOString()}-${t.description}-${t.amount}`;
      const existingKeys = new Set(existingTransactions.map(makeKey));

      const uniqueTransactions = mappedTransactions.filter((t: any) => !existingKeys.has(makeKey(t)));
      const duplicatesCount = mappedTransactions.length - uniqueTransactions.length;

      if (uniqueTransactions.length > 0) {
        await prisma.transaction.createMany({
          data: uniqueTransactions
        });
      }

      console.log(`[uploadController] Saved ${uniqueTransactions.length} new records. skipped ${duplicatesCount} duplicates.`);

      // NEW: For 'Audit Fidelity', we link existing (duplicate) transactions to the current statement 
      // so the ledger shows the FULL content of the uploaded file.
      if (duplicatesCount > 0) {
        // Collect IDs of existing transactions that match our file's mapped data
        // DEEP REFRESH: Re-categorize and Re-link duplicates
        let relinkedCount = 0;
        await Promise.all(
          existingTransactions
            .filter(ext => {
              const key = `${new Date(ext.date).toISOString()}-${ext.description}-${ext.amount}`;
              return mappedTransactions.some(mt => `${new Date(mt.date).toISOString()}-${mt.description}-${mt.amount}` === key);
            })
            .map(async (ext) => {
              // Find the original parsed item to get the latest type data if needed
              const matchingItem = mappedTransactions.find(mt => 
                `${new Date(mt.date).toISOString()}-${mt.description}-${mt.amount}` === 
                `${new Date(ext.date).toISOString()}-${ext.description}-${ext.amount}`
              );

              if (matchingItem) {
                await prisma.transaction.update({
                  where: { id: ext.id },
                  data: { 
                    statementId: statement.id,
                    category: matchingItem.category, // Use the new category from MoniqoBrain
                    type: matchingItem.type         // Ensure directionality is corrected
                  }
                });
                relinkedCount++;
              }
            })
        );

        console.log(`[uploadController] Deep-Refreshed and re-linked ${relinkedCount} duplicates.`);
      }

      // 4. Update Statement to PROCESSED
      await prisma.statement.update({
        where: { id: statement.id },
        data: { status: 'PROCESSED' }
      });

      res.status(201).json({
        message: uniqueTransactions.length > 0 
            ? `Successfully processed ${uniqueTransactions.length} new transactions.` 
            : 'Audit complete. All transactions in this file were already in your system.',
        count: uniqueTransactions.length,
        totalInFile: mappedTransactions.length,
        duplicatesCount,
        statementId: statement.id
      });

    } catch (processingError: any) {
      console.error('[uploadController] Processing Error:', processingError);
      await prisma.statement.update({
        where: { id: statement.id },
        data: { status: 'FAILED' }
      });
      throw processingError;
    }

  } catch (error: any) {
    console.error('[uploadController] Fatal Global Error:', error);
    res.status(500).json({ 
      error: 'The Moniqo extraction engine encountered a failure.',
      details: error.message,
      diagnostic: 'Critical failure in processing pipeline'
    });
  }
};
