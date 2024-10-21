
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:4000', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json', 
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mov-token'); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
