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
        _count: { select: { transactions: true } },
      },
    });

    res.json(statements.map((s) => ({
      id: s.id,
      filename: s.filename,
      status: s.status,
      createdAt: s.createdAt,
      count: s._count.transactions,
    })));
  } catch {
    res.status(500).json({ error: 'Failed to fetch statements' });
  }
};

export const deleteStatement = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const statement = await prisma.statement.findUnique({ where: { id } });
    if (!statement || statement.userId !== userId) {
      return res.status(404).json({ error: 'Statement not found' });
    }

    // Delete related transactions first (cascade isn't set in schema)
    await prisma.transaction.deleteMany({ where: { statementId: id } });
    await prisma.statement.delete({ where: { id } });

    res.json({ message: 'Statement deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete statement' });
  }
};
