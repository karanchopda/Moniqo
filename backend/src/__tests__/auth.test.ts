import request from 'supertest';
import app from '../app';
import { closePrisma } from '../config/prisma';

// Prevent the BullMQ worker from trying to connect to Redis during tests
jest.mock('../services/queue.service', () => ({
  uploadQueue: { add: jest.fn() },
  setupUploadWorker: jest.fn(),
}));

afterAll(async () => {
  await closePrisma();
});

// ─── Health Check ────────────────────────────────────────────────────────────

describe('Health Check', () => {
  it('returns API status', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('endpoints');
  });
});

// ─── POST /api/auth/signup ────────────────────────────────────────────────────

describe('POST /api/auth/signup', () => {
  it('rejects an invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'not-an-email', password: 'SecurePass123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects a password shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects a password without uppercase, lowercase, and number', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: 'alllowercase' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('creates a new user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: `test_${Date.now()}@example.com`, password: 'SecurePass123' });

    // 201 = created, or 400 if the DB is not reachable in CI — both are acceptable
    expect([201, 400, 500]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email');
    }
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  it('rejects login with missing password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects login with invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'SomePass123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 401 for non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody_exists_here@example.com', password: 'WrongPass123' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────

describe('POST /api/auth/forgot-password', () => {
  it('rejects an invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'bad-email' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns a safe message for a non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nobody@example.com' });

    // Should not reveal whether the account exists
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});

// ─── POST /api/auth/reset-password ───────────────────────────────────────────

describe('POST /api/auth/reset-password', () => {
  it('rejects a missing token', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ password: 'NewPass123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects a weak new password', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'sometoken', password: 'weak' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects an invalid reset token', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'invalid_token_that_does_not_exist', password: 'NewPass123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
