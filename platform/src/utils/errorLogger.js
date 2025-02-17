const logAuthError = (error, context = {}) => {
  const timestamp = new Date().toISOString();
  const errorDetails = {
    timestamp,
    type: 'AUTH_ERROR',
    message: error.message,
    code: error.code || 'UNKNOWN',
    context,
    stack: error.stack
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.group('🔐 Auth Error');
    console.log('Timestamp:', timestamp);
    console.log('Context:', context);
    console.log('Error:', error);
    console.groupEnd();
  }

  // Here you could add additional logging services
  // For example, sending to a logging service or storing in localStorage
  
  return errorDetails;
};

const getErrorMessage = (error) => {
  // Common Supabase auth error codes
  const errorMessages = {
    'auth/invalid-email': 'auth.errors.invalidEmail',
    'auth/user-disabled': 'auth.errors.userDisabled',
    'auth/user-not-found': 'auth.errors.userNotFound',
    'auth/wrong-password': 'auth.errors.wrongPassword',
    'auth/email-already-in-use': 'auth.errors.emailInUse',
    'auth/weak-password': 'auth.errors.weakPassword',
    'auth/invalid-login-credentials': 'auth.errors.invalidCredentials',
    'auth/network-request-failed': 'auth.errors.networkError',
    'auth/too-many-requests': 'auth.errors.tooManyRequests',
    'auth/internal-error': 'auth.errors.serverError',
    // Add more error codes as needed
  };

  // If we have a specific message for this error code, use it
  // Otherwise, use the error message from the error object
  return errorMessages[error.code] || error.message;
};

export { logAuthError, getErrorMessage };
