export const API_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:4444',
  
  ENDPOINTS: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    REFRESH_TOKEN: '/users/refresh-token',
    POSTS: '/posts',
  },
  
  AUTH: {
    TOKEN_KEY: 'admin_token',
    REFRESH_TOKEN_KEY: 'admin_refresh_token',
    TOKEN_EXPIRY_KEY: 'admin_token_expiry',
  }
};