import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/police";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllEmergencies = async () => {
  return apiClient.get('/emergency/all');
};

export const getActiveEmergencies = async () => {
  return apiClient.get('/emergency/active');
};

export const getEmergencyById = async (id) => {
  return apiClient.get(`/emergency/${id}`);
};

export const getEmergencyMedia = async (id) => {
  return apiClient.get(`/emergency/${id}/image`, {
    responseType: 'blob'
  });
};

export const updateEmergencyStatus = async (id, status) => {
  return apiClient.put(`/emergency/status/${id}`, { status });
};
