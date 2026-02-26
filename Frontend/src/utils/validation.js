// Validation Constants - Keep these patterns consistent between frontend and backend

export const VALIDATION_PATTERNS = {
  // Full Name: Only alphabets and spaces, minimum 3 characters
  FULL_NAME: /^[A-Za-z\s]{3,}$/,
  
  // Email: Standard email format
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Indian Mobile: Exactly 10 digits, starts with 6, 7, 8, or 9
  MOBILE: /^[6-9]\d{9}$/,
  
  // Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

export const VALIDATION_MESSAGES = {
  FULL_NAME: "Full name must contain only letters and spaces (minimum 3 characters)",
  EMAIL: "Please enter a valid email address",
  MOBILE: "Mobile number must be 10 digits starting with 6, 7, 8, or 9",
  PASSWORD: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character",
  CONFIRM_PASSWORD: "Passwords do not match",
  REQUIRED: "This field is required"
};

export const validateField = (fieldName, value, confirmValue = null) => {
  if (!value || value.trim() === '') {
    return VALIDATION_MESSAGES.REQUIRED;
  }

  switch (fieldName) {
    case 'fullName':
      return VALIDATION_PATTERNS.FULL_NAME.test(value) ? null : VALIDATION_MESSAGES.FULL_NAME;
    case 'email':
      return VALIDATION_PATTERNS.EMAIL.test(value) ? null : VALIDATION_MESSAGES.EMAIL;
    case 'phoneNumber':
      return VALIDATION_PATTERNS.MOBILE.test(value) ? null : VALIDATION_MESSAGES.MOBILE;
    case 'password':
      return VALIDATION_PATTERNS.PASSWORD.test(value) ? null : VALIDATION_MESSAGES.PASSWORD;
    case 'confirmPassword':
      return value === confirmValue ? null : VALIDATION_MESSAGES.CONFIRM_PASSWORD;
    default:
      return null;
  }
};