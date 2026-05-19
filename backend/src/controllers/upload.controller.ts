import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/prisma';
import { uploadQueue } from '../services/queue.service';

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

    try {
      // 3. Queue the statement processing job in BullMQ background queue
      await uploadQueue.add('process-statement', {
        statementId: statement.id,
        userId,
        originalname,
        buffer: buffer, // BullMQ serializes Buffer automatically
        password
      });

      console.log(`[uploadController] Statement ${statement.id} queued for background processing.`);

      return res.status(202).json({
        message: 'Statement uploaded and queued for processing.',
        statementId: statement.id,
        status: 'PROCESSING'
      });

    } catch (processingError: any) {
      console.error('[uploadController] Queue Add Error:', processingError);
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

export const getStatementStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const statement = await prisma.statement.findUnique({
      where: { id: id as string },
      include: {
        transactions: true
      }
    }) as any;

    if (!statement) {
      return res.status(404).json({ error: 'Statement not found' });
    }

    if (statement.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to view this statement' });
    }

    return res.status(200).json({
      id: statement.id,
      status: statement.status,
      filename: statement.filename,
      fileUrl: statement.fileUrl,
      createdAt: statement.createdAt,
      count: statement.transactions.length
    });
  } catch (error: any) {
    console.error('[uploadController] Status Query Error:', error);
    res.status(500).json({ error: 'Failed to retrieve statement status.' });
  }
};
