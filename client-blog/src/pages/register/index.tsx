import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      setMessage({
        text: "As senhas não coincidem",
        type: "error"
      });
      return;
    }
    
    if (form.password.length < 6) {
      setMessage({
        text: "A senha deve ter pelo menos 6 caracteres",
        type: "error"
      });
      return;
    }
    if (!form.username.trim()) {
      setMessage({ text: "O nome de usuário é obrigatório", type: "error" });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/users/register`, {
        username: form.username,
        password: form.password,
        role: "CLIENTE",
      });
      
      setMessage({
        text: "Usuário cadastrado com sucesso! Redirecionando para o login...",
        type: "success"
      });
      
      setForm({ username: "", password: "", confirmPassword: "" });
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      
      setMessage({
        text: axios.isAxiosError(error)
          ? error.response?.data?.message || "Erro ao cadastrar. Verifique os dados."
          : "Erro inesperado ao cadastrar usuário.",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Crie sua conta</h2>
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
              placeholder="Mínimo de 6 caracteres"
              className="mt-1 bg-gray-100 text-gray-800 placeholder-gray-500"
              autoComplete="new-password"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar Senha</Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Digite a senha novamente"
              className="mt-1 bg-gray-100 text-gray-800 placeholder-gray-500"
              autoComplete="new-password"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

<p className="mt-6 text-center text-sm text-gray-600">
  Já tem uma conta?{" "}
  <Link href="/login" className="text-blue-600 hover:underline font-medium">
    Faça login
  </Link>
</p>
      </div>
    </div>
  );
}
