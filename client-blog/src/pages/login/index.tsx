import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode"; 

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

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        username: form.username,
        password: form.password,
      });
  
      const { token } = response.data;
      localStorage.setItem("token", token);
      
      const decoded: DecodedToken = jwtDecode(token);
      console.log("Roles recebidas:", decoded.roles);
  
      // Verificação corrigida para ROLE_ADMIN
      const isAdmin = decoded.roles?.some(role => 
        role === "ROLE_ADMIN" || 
        role === "ADMIN" ||
        role.endsWith("_ADMIN")
      );
  
      if (isAdmin) {
        await router.push("/admin");
        console.log("Redirecionando ADMIN para /admin");
      } else {
        await router.push("/");
        console.log("Redirecionando USER para /");
      }
  
      setMessage("Login realizado com sucesso!");
    } catch (error) {
      console.error("Erro detalhado:", error);
      setMessage("Erro ao logar. Verifique usuário e senha.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Entre com sua conta</h2>
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
              className="mt-1 bg-gray-100 text-gray-800 placeholder-gray-500"
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
              className="mt-1 bg-gray-100 text-gray-800 placeholder-gray-500"
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
            Logar
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-600 font-medium">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta?{" "}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}
