import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode"; 
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DecodedToken {
  iss: string;
  sub: string;
  roles: string[];
  exp: number;
  [key: string]: any;
}

interface LoginResponse {
  id: number;
  username: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { returnTo } = router.query;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const redirectToMicrofrontend = async (token: string, refreshToken: string, expiresAt: string) => {
    try {
      // 1. Armazenamento seguro dos tokens
      sessionStorage.setItem('mf:admin:token', token); // Mais seguro que localStorage
      localStorage.setItem('mf:admin:refreshToken', refreshToken);
      localStorage.setItem('mf:admin:expiresAt', expiresAt);
      localStorage.setItem('mf:admin:lastAuth', Date.now().toString());
      
      const adminBaseUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL || 'http://localhost:3000';
      

      let targetPath = '/admin/posts';
      if (typeof returnTo === 'string' && returnTo.startsWith('/admin/')) {
        targetPath = returnTo;
      }
      
      const redirectUrl = new URL(targetPath, adminBaseUrl);
      
      redirectUrl.hash = `token=${encodeURIComponent(token)}`;
      
      window.location.assign(redirectUrl.toString());
    } catch (error) {
      console.error("Redirecionamento falhou:", error);
      await router.push({
        pathname: '/admin-fallback',
        query: { error: 'microfrontend_unavailable' }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.username || !form.password) {
      setMessage({
        text: "Por favor, preencha todos os campos",
        type: "error"
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await axios.post<LoginResponse>(
        `${apiUrl}/users/login`,
        {
          username: form.username,
          password: form.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const { token, refreshToken, expiresAt } = response.data;
      
      sessionStorage.setItem('auth:token', token);
      localStorage.setItem('auth:refreshToken', refreshToken);
      localStorage.setItem('auth:expiresAt', expiresAt);
      localStorage.setItem('auth:lastLogin', Date.now().toString());
      
      const decoded: DecodedToken = jwtDecode(token);
      
      const isAdmin = decoded.roles?.some(role => 
        ["ROLE_ADMIN", "ADMIN"].includes(role.toUpperCase())
      );

      setMessage({
        text: "Login realizado com sucesso!",
        type: "success"
      });

      if (isAdmin) {
        await redirectToMicrofrontend(token, refreshToken, expiresAt);
      } else {
        const redirectPath = typeof returnTo === 'string' && !returnTo.startsWith('/admin/') 
          ? returnTo 
          : '/';
        await router.push(redirectPath);
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error);
      
      setMessage({
        text: axios.isAxiosError(error) 
          ? error.response?.data?.message || "Credenciais inválidas"
          : "Erro inesperado ao fazer login",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Entre com sua conta</h2>
        
        {message && (
          <div className={`mb-6 p-3 rounded text-center ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="username" className="text-gray-700">Usuário</Label>
            <Input
              type="text"
              name="username"
              id="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Seu nome de usuário"
              className="mt-1 bg-gray-100 text-gray-800 placeholder-gray-500"
              autoComplete="username"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-700">Senha</Label>
            <Input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Sua senha"
              className="mt-1 bg-gray-100 text-gray-800 placeholder-gray-500"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
