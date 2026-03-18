import axios from 'axios';
import { Platform } from 'react-native';

// Whether or not to use the Azure backend (default is False)
// You can configure this by setting EXPO_PUBLIC_USE_PROD_API in frontend/cu-bytes/.env
const USE_PROD_API =
  typeof process !== "undefined" &&
  process.env?.EXPO_PUBLIC_USE_PROD_API === "true";

const PROD_URL = "https://cu-bytes-e2cnaff9e2cgg5hk.eastus2-01.azurewebsites.net";

// Set to the IP address of the backend, android emulator as fallback
const LOCAL_IP = typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_IP
    ? process.env.EXPO_PUBLIC_API_IP
    : '10.0.2.2';

const LOCAL_PORT = "5000";

const getAPIBaseURL = () => {
  if (USE_PROD_API) {
    console.log("Using AZURE production backend");
    return PROD_URL;
  }

  if (__DEV__) {
    if (Platform.OS === "web") {
      console.log("Using localhost backend (web)");
      return `http://localhost:${LOCAL_PORT}`;
    }
    if (Platform.OS === "android") {
      console.log("Using Android backend");
      return `http://${LOCAL_IP}:${LOCAL_PORT}`;
    }
    // iOS (simulator uses localhost; device uses LOCAL_IP)
    console.log("Using iOS backend");
    return `http://${LOCAL_IP}:${LOCAL_PORT}`;
  }
  console.log("Fallback to production backend");
  return PROD_URL;
};

export const API_BASE_URL = getAPIBaseURL();
console.log('Platform:', Platform.OS);
console.log('API Base URL:', API_BASE_URL);
console.log('Config LOCAL_IP:', LOCAL_IP);

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
