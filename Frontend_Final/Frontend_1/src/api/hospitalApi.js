import axios from "axios";

const API_BASE_URL = "https://localhost:7075/api/hospital";

// Add JWT token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const getAllEmergencies = async () => {
  return axios.get(`${API_BASE_URL}/emergencies`, getAuthHeaders());
};

export const getEmergencyById = async (id) => {
  return axios.get(`${API_BASE_URL}/emergency/${id}`, getAuthHeaders());
};

export const updateEmergencyStatus = async (id, status) => {
  return axios.put(
    `${API_BASE_URL}/emergency/status/${id}`,
    status,
    getAuthHeaders()
  );
};