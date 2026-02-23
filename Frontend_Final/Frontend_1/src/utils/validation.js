// Validation utility with regex patterns
export const validationPatterns = {
  // Name: 2-50 characters, letters, spaces, hyphens, apostrophes only
  name: /^[a-zA-Z\s'-]{2,50}$/,
  
  // Email: standard email format
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Phone: 10-15 digits, optional country code, spaces, hyphens, parentheses
  phone: /^[\+]?[1-9][\d]{0,10}$/,
  
  // Password: 8-50 chars, at least 1 uppercase, 1 lowercase, 1 number
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,50}$/,
  
  // Description: 10-1000 characters, letters, numbers, basic punctuation
  description: /^[a-zA-Z0-9\s.,!?;:'"()-]{10,1000}$/,
  
  // Image file: jpg, jpeg, png, gif extensions
  imageFile: /\.(jpg|jpeg|png|gif)$/i
};

export const validationMessages = {
  name: "Name must be 2-50 characters, letters only",
  email: "Please enter a valid email address",
  phone: "Phone must be 10 digits",
  password: "Password must be 8+ chars with uppercase, lowercase, and number",
  description: "Description must be 10-1000 characters",
  imageFile: "Only JPG, PNG, GIF files allowed"
};

export const validateField = (field, value) => {
  if (!value || value.trim() === '') return "This field is required";
  
  const pattern = validationPatterns[field];
  if (pattern && !pattern.test(value.trim())) {
    return validationMessages[field];
  }
  
  return null;
};

export const validateImageFile = (file) => {
  if (!file) return "Image is required";
  
  if (!validationPatterns.imageFile.test(file.name)) {
    return validationMessages.imageFile;
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    return "Image must be less than 10MB";
  }
  
  return null;
};