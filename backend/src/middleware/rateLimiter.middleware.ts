import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// In test environment, skip all rate limiting so tests don't interfere with each other
const isTest = process.env.NODE_ENV === 'test';
const passThrough = (_req: Request, _res: Response, next: NextFunction) => next();

const makeLimit = (options: Parameters<typeof rateLimit>[0]) =>
  isTest ? passThrough : rateLimit(options);

// General API rate limiter
export const apiLimiter = makeLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again later.', retryAfter: '15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
export const authLimiter = makeLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many authentication attempts, please try again later.', retryAfter: '15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Upload rate limiter
export const uploadLimiter = makeLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many file uploads, please try again later.', retryAfter: '1 hour' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat/AI rate limiter
export const chatLimiter = makeLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many chat requests, please slow down.', retryAfter: '1 minute' },
  standardHeaders: true,
  legacyHeaders: false,
});
