import { Router } from 'express';
import multer from 'multer';
import { uploadStatement, getStatementStatus } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/octet-stream'];
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (allowed.includes(file.mimetype) || ext === 'csv' || ext === 'pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and CSV files are allowed'));
    }
  },
});

router.post('/', authenticate, upload.single('file'), uploadStatement);
router.get('/status/:id', authenticate, getStatementStatus);

export default router;
