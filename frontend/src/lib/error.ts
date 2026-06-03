/**
 * Safely extracts a user-friendly error message from any error response structure.
 * Prevents "Objects are not valid as a React child" errors (Minified React Error #31).
 */
export const getErrorMessage = (err: any, fallback: string = 'An error occurred'): string => {
  if (!err) return fallback;
  
  // If it's an Axios error structure
  if (err.response?.data) {
    const data = err.response.data;
    if (typeof data === 'string') return data;
    if (typeof data === 'object') {
      const errorVal = data.error || data;
      if (typeof errorVal === 'string') return errorVal;
      if (typeof errorVal === 'object') {
        if (errorVal.message && typeof errorVal.message === 'string') return errorVal.message;
        if (errorVal.error && typeof errorVal.error === 'string') return errorVal.error;
        if (errorVal.code && typeof errorVal.code === 'string') {
          return `${errorVal.code}${errorVal.message ? `: ${errorVal.message}` : ''}`;
        }
        return JSON.stringify(errorVal);
      }
    }
  }

  // If it has a direct message field
  if (err.message && typeof err.message === 'string') return err.message;
  if (err.error && typeof err.error === 'string') return err.error;

  if (typeof err === 'string') return err;
  return JSON.stringify(err);
};
