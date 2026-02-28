import axios from 'axios';
import { Platform } from 'react-native';

// Simple configuration - change this IP when needed
const API_CONFIG = {
  // Android emulator: use 10.0.2.2 to reach host. Physical device: use your PC's LAN IP (e.g. 10.0.0.44).
  LOCAL_IP: typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_IP
    ? process.env.EXPO_PUBLIC_API_IP
    : '10.0.0.44',
  PORT: 5000
};

// Determine the correct API URL based on platform
const getAPIBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      return `http://localhost:${API_CONFIG.PORT}`;
    }
    if (Platform.OS === 'android') {
      // Emulator: 10.0.2.2 is the host. Override with EXPO_PUBLIC_API_IP for physical device.
      const host = typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_IP
        ? process.env.EXPO_PUBLIC_API_IP
        : '10.0.2.2';
      return `http://${host}:${API_CONFIG.PORT}`;
    }
    // iOS (simulator uses localhost; device uses LOCAL_IP)
    return `http://${API_CONFIG.LOCAL_IP}:${API_CONFIG.PORT}`;
  }
  return 'https://your-production-url.com';
};

export const API_BASE_URL = getAPIBaseURL();
console.log('Platform:', Platform.OS);
console.log('API Base URL:', API_BASE_URL);
console.log('Config LOCAL_IP:', API_CONFIG.LOCAL_IP);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      platform: Platform.OS
    });
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // ML Prediction
  async predictFood(imageUri: string) {
    // Convert image URI to FormData for upload
    const formData = new FormData();
    
    // For web, we need to fetch the image and convert to blob
    if (Platform.OS === 'web') {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      formData.append('image', file);
    } else {
      // For mobile (React Native)
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);
    }

    const response = await api.post('/ml/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
