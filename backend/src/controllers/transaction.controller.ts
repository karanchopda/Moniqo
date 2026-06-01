import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/prisma';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // --- Pagination ---
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip  = (page - 1) * limit;

    // --- Filters ---
    const category = req.query.category as string | undefined;
    const type     = req.query.type     as string | undefined;
    const search   = req.query.search   as string | undefined;

    const where: any = { userId };

    if (category && category !== 'All') {
      where.category = category;
    }

    if (type && type !== 'All') {
      where.type = type.toLowerCase();
    }

    if (search && search.trim()) {
      where.description = { contains: search.trim(), mode: 'insensitive' };
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { date, description, amount, type, category } = req.body;

    if (!date || !description || amount === undefined || !type || !category) {
      return res.status(400).json({ error: 'date, description, amount, type, and category are required' });
    }

    if (!['debit', 'credit'].includes(type.toLowerCase())) {
      return res.status(400).json({ error: 'type must be debit or credit' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        date: new Date(date),
        description,
        amount: Number(amount),
        type: type.toLowerCase(),
        category,
      },
    });

    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};
