import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      const isAuthenticated = await authService.checkAndRefreshAuth();
      
      if (!isAuthenticated) {
        const currentPath = window.location.pathname;
        authService.redirectToLogin(currentPath);
        return;
      }
      
      const isAdmin = authService.isAdmin();
      
      if (!isAdmin) {
        router.push("/login?error=unauthorized");
        return;
      }
      
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}