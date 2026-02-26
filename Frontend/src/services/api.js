import axios from 'axios';

// Use environment variable or fallback to development URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyOtp: (otpData) => api.post('/auth/verify-email-otp', otpData),
  resendOtp: (emailData) => api.post('/auth/resend-email-otp', emailData),
};

export const citizenAPI = {
  // Test authentication
  testAuth: () => api.get('/citizen/test-auth'),
  
  // Profile APIs
  getProfile: (citizenId) => api.get(`/citizen/profile/${citizenId}`),
  updateProfile: (citizenId, profileData) =>
    api.put(`/citizen/profile/${citizenId}`, profileData),

  // Emergency APIs
  createMessageEmergency: (emergencyData) =>
    api.post('/citizen/emergency/message', emergencyData),

  createImageEmergency: (formData) =>
    api.post('/citizen/emergency/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  createPanicAlert: (targetDepartment = 'BOTH', latitude = null, longitude = null, address = null) => {
    const payload = { targetDepartment };
    if (latitude && longitude) {
      payload.latitude = latitude;
      payload.longitude = longitude;
      payload.address = address;
    }
    return api.post('/citizen/emergency/alert', payload);
  },

  getEmergency: (id) =>
    api.get(`/citizen/emergency/${id}`),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications/citizen'),
  getUnreadNotifications: () => api.get('/notifications/citizen/unread'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export const adminAPI = {
  testConnection: () => api.get('/admin/test'),
  getAllUsers: () => api.get('/admin/users'),
  getAllContacts: () => api.get('/admin/contacts'),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  updateUserRole: (id, roleData) => api.put(`/admin/users/${id}/role`, roleData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// ================= FEEDBACK API =================
export const feedbackAPI = {
  submitFeedback: (feedbackData) =>
    api.post('/feedback', feedbackData),

  getMyFeedbacks: () =>
    api.get('/feedback'),

  // getMyFeedbacks: (citizenId) =>
  //   api.get(`/feedback/user/${citizenId}`),
};


export default api;