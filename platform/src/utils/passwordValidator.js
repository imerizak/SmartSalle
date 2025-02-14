export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  
  if (password.length < minLength) {
    errors.push('password.minLength');
  }
  if (!hasUpperCase) {
    errors.push('password.upperCase');
  }
  if (!hasLowerCase) {
    errors.push('password.lowerCase');
  }
  if (!hasNumbers) {
    errors.push('password.number');
  }
  if (!hasSpecialChar) {
    errors.push('password.special');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
