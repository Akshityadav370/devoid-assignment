import axios from 'axios';
import { API_BASE_URL, getOrCreateStorageId } from '../utils';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const storageId = getOrCreateStorageId();
    config.headers['X-Storage-Id'] = storageId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw new Error(error.response.data.message || 'Request failed');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error('Request failed: ' + error.message);
    }
  }
);

export default axiosInstance;
