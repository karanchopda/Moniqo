import prisma from '../config/prisma';
import { parseCSV } from '../utils/csvParser';
import { parsePDF } from '../utils/pdfParser';
import { categorizeTransaction, cleanMerchantName } from '../utils/categorizer';

// ─── Redis / BullMQ (optional) ───────────────────────────────────────────────
// If Redis is not available the service falls back to synchronous in-process
// processing so the rest of the app (auth, transactions, reports, chat) keeps
// working even in environments without Redis.

let Queue: any = null;
let Worker: any = null;
let IORedis: any = null;
let redisConnection: any = null;
let uploadQueue: any = null;
let useRedis = false;

async function tryInitRedis() {
  try {
    const bullmq    = await import('bullmq');
    const ioredis   = await import('ioredis');
    Queue  = bullmq.Queue;
    Worker = bullmq.Worker;
    IORedis = ioredis.default;

    redisConnection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
      maxRetriesPerRequest: null,
      connectTimeout: 3000,
      lazyConnect: true,
    });

    await redisConnection.connect();
    await redisConnection.ping();

    uploadQueue = new Queue('upload-processing', { connection: redisConnection });
    useRedis = true;
    console.log('[Queue] ✅ Redis connected — async BullMQ processing enabled');
  } catch (err: any) {
    console.warn('[Queue] ⚠️  Redis unavailable —', err.message);
    console.warn('[Queue] Falling back to synchronous in-process upload handling.');
    useRedis = false;
  }
}

// Initialise once at module load
const redisReady = tryInitRedis();

// ─── Core processing logic (shared by both paths) ────────────────────────────
async function processUploadJob(data: {
  statementId: string;
  userId: string;
  originalname: string;
  buffer: any;
  password?: string;
}) {
  const { statementId, userId, originalname, buffer, password } = data;
  console.log(`[Worker] Processing statement ${statementId} for user ${userId}`);

  let transactionsData: any[] = [];
  const fileBuffer = Buffer.from(buffer);

  if (originalname.endsWith('.csv')) {
    transactionsData = await parseCSV(fileBuffer);
  } else if (originalname.endsWith('.pdf')) {
    transactionsData = await parsePDF(fileBuffer, password);
  } else {
    throw new Error('Unsupported file format');
  }

  if (transactionsData.length === 0) {
    await prisma.statement.update({ where: { id: statementId }, data: { status: 'PROCESSED' } });
    return { success: true, count: 0 };
  }

  const mappedTransactions = transactionsData.map((t) => {
    const cleanedDesc = cleanMerchantName(t.description);
    return {
      userId,
      statementId,
      date: t.date,
      description: cleanedDesc,
      amount: t.amount,
      type: t.type,
      category: categorizeTransaction(cleanedDesc, t.type),
      balance: t.balance,
    };
  });

  // Deduplication
  const dates = mappedTransactions.map((t: any) => new Date(t.date));
  const minDate = new Date(Math.min(...dates.map((d: Date) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d: Date) => d.getTime())));

  const existingTransactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: minDate, lte: maxDate } },
    select: { id: true, date: true, description: true, amount: true },
  });

  const makeKey = (t: any) => `${new Date(t.date).toISOString()}-${t.description}-${t.amount}`;
  const existingKeys = new Set(existingTransactions.map(makeKey));
  const uniqueTransactions = mappedTransactions.filter((t: any) => !existingKeys.has(makeKey(t)));
  const duplicatesCount = mappedTransactions.length - uniqueTransactions.length;

  if (uniqueTransactions.length > 0) {
    await prisma.transaction.createMany({ data: uniqueTransactions });
  }

  if (duplicatesCount > 0) {
    let relinkedCount = 0;
    await Promise.all(
      existingTransactions
        .filter(ext => {
          const key = makeKey(ext);
          return mappedTransactions.some((mt: any) => makeKey(mt) === key);
        })
        .map(async (ext) => {
          const matching = mappedTransactions.find(
            (mt: any) => makeKey(mt) === makeKey(ext)
          );
          if (matching) {
            await prisma.transaction.update({
              where: { id: ext.id },
              data: { statementId, category: matching.category, type: matching.type },
            });
            relinkedCount++;
          }
        })
    );
    console.log(`[Worker] Re-linked ${relinkedCount} duplicates.`);
  }

  await prisma.statement.update({ where: { id: statementId }, data: { status: 'PROCESSED' } });
  console.log(`[Worker] Done ${statementId}: ${uniqueTransactions.length} inserted, ${duplicatesCount} deduped.`);
  return { success: true, count: uniqueTransactions.length };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Enqueue a statement for processing.
 * Uses BullMQ if Redis is available, otherwise processes synchronously.
 */
export async function enqueueUpload(jobData: {
  statementId: string;
  userId: string;
  originalname: string;
  buffer: any;
  password?: string;
}) {
  await redisReady; // wait for Redis probe to finish

  if (useRedis && uploadQueue) {
    await uploadQueue.add('process', jobData, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
    console.log(`[Queue] Job enqueued for statement ${jobData.statementId}`);
  } else {
    // Sync fallback — process immediately in the same process
    console.log(`[Queue] Sync processing statement ${jobData.statementId}`);
    try {
      await processUploadJob(jobData);
    } catch (err: any) {
      const newStatus = err.message === 'PASSWORD_REQUIRED' ? 'PASSWORD_REQUIRED' : 'FAILED';
      await prisma.statement.update({
        where: { id: jobData.statementId },
        data: { status: newStatus },
      });
      console.error(`[Queue] Sync processing failed: ${err.message}`);
    }
  }
}

/**
 * Start the BullMQ worker (no-op when Redis is unavailable).
 */
export async function setupUploadWorker() {
  await redisReady;

  if (!useRedis || !Worker || !redisConnection) {
    console.log('[Worker] Skipping BullMQ worker — running in sync mode.');
    return;
  }

  console.log('[Worker] Starting BullMQ upload worker…');

  const worker = new Worker(
    'upload-processing',
    async (job: any) => processUploadJob(job.data),
    { connection: redisConnection }
  );

  worker.on('failed', (job: any, err: any) => {
    console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
  });
}

// Keep backward compat — upload controller may import uploadQueue directly
export { uploadQueue };
