import axios from 'axios';

const API_BASE_URL = 'https://localhost:7075/api';

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
  login: (credentials) => api.post('/Auth/login', credentials),
  register: (userData) => api.post('/Auth/register', userData),
  sendOtp: (emailData) => api.post('/Auth/send-otp', emailData),
  verifyOtp: (otpData) => api.post('/Auth/verify-otp', otpData),
};

export const citizenAPI = {
  // Profile APIs
  getProfile: (citizenId) => api.get(`/Citizen/profile/${citizenId}`),
  updateProfile: (citizenId, profileData) => api.put(`/Citizen/profile/${citizenId}`, profileData),
  
  // Emergency APIs
  createMessageEmergency: (emergencyData) => api.post('/Citizen/emergency/message', emergencyData),
  createImageEmergency: (formData) => api.post('/Citizen/emergency/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createDirectEmergency: (locationData) => api.post('/Citizen/emergency/alert', locationData),
  createPanicAlert: (locationData) => api.post('/Citizen/emergency/alert', locationData),
  getEmergency: (id) => api.get(`/Citizen/emergency/${id}`),
};

export default api;