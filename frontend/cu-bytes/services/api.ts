import axios from 'axios';
import Constants from 'expo-constants';

/** Avoid referencing `Platform` at module scope before RN is ready (web static export / odd init order). */
function rnPlatformOS(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Platform } = require('react-native') as typeof import('react-native');
    return Platform?.OS ?? 'web';
  } catch {
    return typeof document !== 'undefined' ? 'web' : 'ios';
  }
}

// Whether or not to use the Azure backend (default is False)
// You can configure this by setting EXPO_PUBLIC_USE_PROD_API in frontend/cu-bytes/.env
const USE_PROD_API =
  typeof process !== 'undefined' &&
  process.env?.EXPO_PUBLIC_USE_PROD_API === 'true';

const PROD_URL = 'https://cu-bytes-e2cnaff9e2cgg5hk.eastus2-01.azurewebsites.net';

/** LAN IP of the machine running Flask (physical phone / iOS device). Ignored on Android emulator. */
function getConfiguredLanIp(): string | undefined {
  const raw =
    typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_API_IP?.trim() : '';
  return raw && raw.length > 0 ? raw : undefined;
}

const LOCAL_PORT = '5000';

/**
 * Dev API URL:
 * - Web: localhost
 * - Android emulator: 10.0.2.2 (host machine; do not use your LAN IP here)
 * - Android/iOS physical device: EXPO_PUBLIC_API_IP (same Wi‑Fi as your PC)
 * - iOS simulator: localhost
 */
const getAPIBaseURL = () => {
  if (USE_PROD_API) {
    console.log('Using AZURE production backend');
    return PROD_URL;
  }

  if (__DEV__) {
    const os = rnPlatformOS();
    if (os === 'web') {
      console.log('Using localhost backend (web)');
      return `http://localhost:${LOCAL_PORT}`;
    }

    const lan = getConfiguredLanIp();
    const isPhysicalDevice = Constants.isDevice === true;

    if (os === 'android') {
      if (!isPhysicalDevice) {
        const url = `http://10.0.2.2:${LOCAL_PORT}`;
        console.log('Using Android emulator host loopback:', url);
        return url;
      }
      if (lan) {
        const url = `http://${lan}:${LOCAL_PORT}`;
        console.log('Using Android device LAN backend:', url);
        return url;
      }
      console.warn(
        'EXPO_PUBLIC_API_IP is not set; physical Android may fail to reach your PC. Set it to your computer LAN IP.'
      );
      return `http://10.0.2.2:${LOCAL_PORT}`;
    }

    if (os === 'ios') {
      if (!isPhysicalDevice) {
        const url = `http://localhost:${LOCAL_PORT}`;
        console.log('Using iOS Simulator backend:', url);
        return url;
      }
      if (lan) {
        const url = `http://${lan}:${LOCAL_PORT}`;
        console.log('Using iOS device LAN backend:', url);
        return url;
      }
      console.warn(
        'EXPO_PUBLIC_API_IP is not set; physical iPhone needs your Mac/PC LAN IP in .env'
      );
      return `http://localhost:${LOCAL_PORT}`;
    }

    console.log('Using fallback LAN backend');
    return lan ? `http://${lan}:${LOCAL_PORT}` : `http://localhost:${LOCAL_PORT}`;
  }
  console.log('Fallback to production backend');
  return PROD_URL;
};

export const API_BASE_URL = getAPIBaseURL();
console.log('API Base URL:', API_BASE_URL);

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
      platform: rnPlatformOS(),
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

    if (rnPlatformOS() === 'web') {
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
