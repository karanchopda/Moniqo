import { Router } from 'express';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth.middleware';
import { transactionValidation } from '../middleware/validation.middleware';

const router = Router();

router.get('/',    authenticate, getTransactions);
router.post('/',   authenticate, transactionValidation, createTransaction);
router.put('/:id', authenticate, updateTransaction);
router.delete('/:id', authenticate, deleteTransaction);

export default router;
