import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/hospital";

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

export const testHospitalAuth = async () => {
  return apiClient.get('/test');
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
  return apiClient.put(`/emergency/${id}/status`, { status });
};