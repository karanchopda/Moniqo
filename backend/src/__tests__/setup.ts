// Set NODE_ENV to test before any module is loaded
// This ensures rate limiters are bypassed during the test suite
process.env.NODE_ENV = 'test';
