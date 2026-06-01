import { Router } from 'express';
import { getStatements } from '../controllers/statement.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getStatements);

export default router;
