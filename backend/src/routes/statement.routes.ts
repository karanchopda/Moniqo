import { Router } from 'express';
import { getStatements, deleteStatement } from '../controllers/statement.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/',    authenticate, getStatements);
router.delete('/:id', authenticate, deleteStatement);

export default router;
