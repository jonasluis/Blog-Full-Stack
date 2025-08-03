import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { API_CONFIG } from '@/config/api.config';

export function useAuth(requiredRole?: string) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY) || 
               sessionStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY);
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode<{ roles: string[] }>(token);
      
      if (requiredRole && !decoded.roles?.some(role => 
        role.toUpperCase() === requiredRole.toUpperCase() || 
        role.toUpperCase() === `ROLE_${requiredRole.toUpperCase()}`
      )) {
        router.push('/login?error=unauthorized');
      }
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login?error=invalid_token');
    }
  }, [router, requiredRole]);
}