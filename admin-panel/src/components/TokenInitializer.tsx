import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function TokenInitializer() {
  const router = useRouter();

  useEffect(() => {
    const initializeFromHash = async () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (!hash || !hash.includes('token=')) return;
      
      try {
        const token = decodeURIComponent(hash.split('token=')[1]);
        if (!token) return;
        
        authService.setToken(token, true);
        const refreshToken = localStorage.getItem('auth:refreshToken');
        const expiresAt = localStorage.getItem('auth:expiresAt');
        
        if (refreshToken) {
          authService.setRefreshToken(refreshToken, expiresAt || undefined);
        }
        window.history.replaceState(
          null, 
          document.title, 
          window.location.pathname + window.location.search
        );
        
        const isAuthenticated = await authService.checkAndRefreshAuth();
        if (!isAuthenticated) {
          authService.redirectToLogin();
          return;
        }
        
        if (!authService.isAdmin()) {
          authService.redirectToLogin();
        }
      } catch (error) {
        console.error('Erro ao inicializar token:', error);
        authService.clearTokens();
        authService.redirectToLogin();
      }
    };

    initializeFromHash();
  }, [router]);

  return null;
}