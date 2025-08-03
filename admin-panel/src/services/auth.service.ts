import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_CONFIG } from '@/config/api.config';

interface UserToken {
  sub: string;
  roles: string[];
  exp: number;
  [key: string]: any;
}

interface AuthResponse {
  token: string;
  refreshToken?: string;
}

class AuthService {
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        return false;
      }
      
      return true;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }
  
  async checkAndRefreshAuth(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        return await this.refreshToken();
      }
      
      return true;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }
  
  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      return decoded.roles?.some(role => 
        ["ROLE_ADMIN", "ADMIN"].includes(role.toUpperCase())
      ) || false;
    } catch (error) {
      return false;
    }
  }
  
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY) || 
           sessionStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY);
  }
  
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY);
  }
  
  decodeToken(token: string): UserToken {
    return jwtDecode<UserToken>(token);
  }

  setToken(token: string, remember: boolean = true): void {
    if (typeof window === 'undefined') return;
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    if (remember) {
      localStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, token);
      
      const decoded = this.decodeToken(token);
      if (decoded.exp) {
        localStorage.setItem(API_CONFIG.AUTH.TOKEN_EXPIRY_KEY, decoded.exp.toString());
      }
    } else {
      sessionStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, token);
    }
  }
  
  setRefreshToken(refreshToken: string, expiresAt?: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY, refreshToken);
    
    if (expiresAt) {
      localStorage.setItem(API_CONFIG.AUTH.TOKEN_EXPIRY_KEY, expiresAt);
    }
  }
  
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY);
    sessionStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.AUTH.TOKEN_EXPIRY_KEY);
    
    delete axios.defaults.headers.common['Authorization'];
  }
  
  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;
    
    try {
      const response = await axios.post(`${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}`, {
        refreshToken
      });
      
      const { token, refreshToken: newRefreshToken, expiresAt } = response.data;
      
      if (!token || !newRefreshToken) {
        this.clearTokens();
        return false;
      }
      
      this.setToken(token);
      this.setRefreshToken(newRefreshToken, expiresAt);
      
      return true;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      this.clearTokens();
      return false;
    }
  }
  
  redirectToLogin(returnUrl?: string): void {
    if (typeof window === 'undefined') return;
    
    const loginUrl = new URL('/login', API_CONFIG.CLIENT_URL);
    
    if (returnUrl) {
      loginUrl.searchParams.append('returnTo', returnUrl);
    }
    
    window.location.href = loginUrl.toString();
  }
  
  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decoded = this.decodeToken(token);
      return decoded.sub || null;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();