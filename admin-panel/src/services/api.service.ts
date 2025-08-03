import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { authService } from './auth.service';

axios.defaults.baseURL = API_CONFIG.API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshed = await authService.checkAndRefreshAuth();
      
      if (refreshed) {
        const token = authService.getToken();
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axios(originalRequest);
      } else {
        authService.clearTokens();
        authService.redirectToLogin(window.location.href);
      }
    }
    
    return Promise.reject(error);
  }
);

class ApiService {
  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await axios(config);
    } catch (error) {
      throw error;
    }
  }
  
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({
      method: 'GET',
      url,
      ...config
    });
    return response.data;
  }
  
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({
      method: 'POST',
      url,
      data,
      ...config
    });
    return response.data;
  }
  
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config
    });
    return response.data;
  }
  
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({
      method: 'DELETE',
      url,
      ...config
    });
    return response.data;
  }
  
  async createPost(postData: any): Promise<any> {
    return this.post(API_CONFIG.ENDPOINTS.POSTS, postData);
  }
}

export const apiService = new ApiService();