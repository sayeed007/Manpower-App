import axios, { AxiosInstance, AxiosError } from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { ApiResponse } from '../types/api.types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'https://api.manpowerapp.com', // Replace with your actual API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const { auth } = store.getState();
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

// Generic GET request
export const get = async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
  try {
    const response = await api.get<ApiResponse<T>>(url, { params });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw error;
  }
};

// Generic POST request
export const post = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response = await api.post<ApiResponse<T>>(url, data);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw error;
  }
};

// Generic PUT request
export const put = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response = await api.put<ApiResponse<T>>(url, data);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw error;
  }
};

// Generic PATCH request
export const patch = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response = await api.patch<ApiResponse<T>>(url, data);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw error;
  }
};

// Generic DELETE request
export const remove = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await api.delete<ApiResponse<T>>(url);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw error;
  }
};

// Error handling function
const handleError = (error: AxiosError) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', error.response.data);
    console.error('API Error Status:', error.response.status);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Error Request:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Error Message:', error.message);
  }
};

export default api;