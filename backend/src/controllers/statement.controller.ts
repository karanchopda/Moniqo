import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/prisma';

export const getStatements = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const statements = await prisma.statement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        status: true,
        createdAt: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    const result = statements.map((s) => ({
      id: s.id,
      filename: s.filename,
      status: s.status,
      createdAt: s.createdAt,
      count: s._count.transactions,
    }));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch statements' });
  }
};
