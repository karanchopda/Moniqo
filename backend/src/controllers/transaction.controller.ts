import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/prisma';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};
