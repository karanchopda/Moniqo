import { Router } from 'express';
import multer from 'multer';
import { uploadStatement, getStatementStatus } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticate, upload.single('file'), uploadStatement);
router.get('/status/:id', authenticate, getStatementStatus);

export default router;
