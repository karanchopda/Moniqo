import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import prisma from '../config/prisma';
import { parseCSV } from '../utils/csvParser';
import { parsePDF } from '../utils/pdfParser';
import { categorizeTransaction } from '../utils/categorizer';

// Fallback to localhost if no REDIS_URL is provided in env
const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

export const uploadQueue = new Queue('upload-processing', { 
  connection: redisConnection 
});

export const setupUploadWorker = () => {
  console.log('[Worker] Starting upload processing worker...');

  const worker = new Worker('upload-processing', async (job: Job) => {
    const { statementId, userId, originalname, buffer, password } = job.data;
    console.log(`[Worker] Processing statement ${statementId} for user ${userId}`);

    try {
      let transactionsData: any[] = [];
      const fileBuffer = Buffer.from(buffer); // Reconstruct buffer from JSON stringification in queue

      if (originalname.endsWith('.csv')) {
        transactionsData = await parseCSV(fileBuffer);
      } else if (originalname.endsWith('.pdf')) {
        transactionsData = await parsePDF(fileBuffer, password);
      } else {
        throw new Error('Unsupported file format');
      }

      if (transactionsData.length === 0) {
        await prisma.statement.update({
          where: { id: statementId },
          data: { status: 'PROCESSED' }
        });
        return { success: true, count: 0 };
      }

      const mappedTransactions = transactionsData.map((t) => ({
        userId,
        statementId: statementId,
        date: t.date,
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: categorizeTransaction(t.description, t.type),
        balance: t.balance
      }));

      // Deduplication Logic
      const dates = mappedTransactions.map((t: any) => new Date(t.date));
      const minDate = new Date(Math.min(...dates.map((d: Date) => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map((d: Date) => d.getTime())));

      const existingTransactions = await prisma.transaction.findMany({
        where: { userId, date: { gte: minDate, lte: maxDate } },
        select: { id: true, date: true, description: true, amount: true }
      });

      const makeKey = (t: any) => `${new Date(t.date).toISOString()}-${t.description}-${t.amount}`;
      const existingKeys = new Set(existingTransactions.map(makeKey));

      const uniqueTransactions = mappedTransactions.filter((t: any) => !existingKeys.has(makeKey(t)));

      if (uniqueTransactions.length > 0) {
        await prisma.transaction.createMany({
          data: uniqueTransactions
        });
      }

      await prisma.statement.update({
        where: { id: statementId },
        data: { status: 'PROCESSED' }
      });

      console.log(`[Worker] Completed processing ${statementId}. Inserted ${uniqueTransactions.length} records.`);
      return { success: true, count: uniqueTransactions.length };

    } catch (error: any) {
      console.error(`[Worker] Failed processing ${statementId}:`, error.message);
      
      const newStatus = error.message === 'PASSWORD_REQUIRED' ? 'PASSWORD_REQUIRED' : 'FAILED';
      await prisma.statement.update({
        where: { id: statementId },
        data: { status: newStatus }
      });

      throw error;
    }
  }, { connection: redisConnection });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed with reason: ${err.message}`);
  });
};
