import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import reportRoutes from './routes/report.routes';
import transactionRoutes from './routes/transaction.routes';
import chatRoutes from './routes/chat.routes';
import { setupUploadWorker } from './services/queue.service';
import { apiLimiter, authLimiter, uploadLimiter, chatLimiter } from './middleware/rateLimiter.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limit payload size

// Request logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // Detailed logs in production
} else {
  app.use(morgan('dev')); // Concise logs in development
}

// Apply general rate limiting to all routes
app.use(apiLimiter);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Moniqo API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      upload: '/api/upload',
      report: '/api/report',
      transactions: '/api/transactions',
      chat: '/api/chat'
    }
  });
});

// API Routes (Local) with specific rate limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/upload', uploadLimiter, uploadRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);

// API Routes (Vercel Serverless compatibility)
app.use('/auth', authLimiter, authRoutes);
app.use('/upload', uploadLimiter, uploadRoutes);
app.use('/report', reportRoutes);
app.use('/transactions', transactionRoutes);
app.use('/chat', chatLimiter, chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      '/api/auth/signup',
      '/api/auth/login',
      '/api/auth/verify-email',
      '/api/auth/resend-verification',
      '/api/auth/forgot-password',
      '/api/auth/reset-password'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📧 Email verification system enabled`);
  console.log(`🔐 Password reset system enabled`);
  
  // Initialize BullMQ processing worker
  setupUploadWorker();
});

export default app;
