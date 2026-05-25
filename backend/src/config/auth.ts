export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'test') {
      return 'test_jwt_secret';
    }

    throw new Error('JWT_SECRET is required');
  }

  return secret;
};
