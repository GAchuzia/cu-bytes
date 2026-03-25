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
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** ML upload timeout (cold start + inference on Azure can exceed 15s). */
const ML_PREDICT_TIMEOUT_MS = 120000;

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
  /**
   * POST multipart image to /ml/predict.
   * Uses fetch (not the JSON-configured axios instance) so the browser/RN sets
   * multipart boundaries; axios defaults would send application/json and break uploads.
   */
  async predictFood(imageUri: string) {
    const formData = new FormData();

    if (Platform.OS === 'web') {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      formData.append('image', file);
    } else {
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ML_PREDICT_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE_URL}/ml/predict`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data === 'object' && data && 'error' in data
            ? String((data as { error?: string }).error)
            : res.statusText;
        throw new Error(msg || `Predict failed (${res.status})`);
      }
      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  },
};

export default api;
