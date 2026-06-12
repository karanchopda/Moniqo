import express from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import reportRoutes from './routes/report.routes';
import transactionRoutes from './routes/transaction.routes';
import statementRoutes from './routes/statement.routes';
import userRoutes from './routes/user.routes';
import chatRoutes from './routes/chat.routes';
import twoFactorRoutes from './routes/twoFactor.routes';
import paymentRoutes from './routes/payment.routes';
import { apiLimiter, authLimiter, uploadLimiter, chatLimiter, refreshLimiter } from './middleware/rateLimiter.middleware';

dotenv.config();

const parseOrigins = (value?: string) =>
  value
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) || [];

const defaultDevOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

const allowedOrigins = [
  ...parseOrigins(process.env.FRONTEND_URL),
  ...parseOrigins(process.env.CORS_ORIGINS),
  ...(process.env.NODE_ENV === 'production' ? [] : defaultDevOrigins),
];

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    // Automatically trust Vercel subdomains/deployments to prevent CORS blocks
    if (origin.endsWith('.vercel.app')) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
};

const app = express();

// Stripe webhook needs raw body — must be before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use('/payments/webhook', express.raw({ type: 'application/json' }));

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
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
app.get('/', (_req, res) => {
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
// Extra tight limit on token refresh/logout endpoints
app.use('/api/auth/refresh', refreshLimiter);
app.use('/api/auth/logout',  refreshLimiter);
app.use('/api/upload', uploadLimiter, uploadRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/statements', statementRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/payments', paymentRoutes);

// API Routes (Vercel Serverless compatibility)
app.use('/auth', authLimiter, authRoutes);
app.use('/auth/refresh', refreshLimiter);
app.use('/auth/logout',  refreshLimiter);
app.use('/upload', uploadLimiter, uploadRoutes);
app.use('/report', reportRoutes);
app.use('/transactions', transactionRoutes);
app.use('/statements', statementRoutes);
app.use('/users', userRoutes);
app.use('/chat', chatLimiter, chatRoutes);
app.use('/2fa', twoFactorRoutes);
app.use('/payments', paymentRoutes);

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

export default app;
