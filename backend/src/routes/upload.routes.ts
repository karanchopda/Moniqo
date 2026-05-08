import { Router } from 'express';
import multer from 'multer';
import { uploadStatement } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticate, upload.single('file'), uploadStatement);

export default router;
