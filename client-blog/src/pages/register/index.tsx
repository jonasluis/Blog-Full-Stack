import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/users/register", {
        username: form.username,
        password: form.password,
        role: "CLIENTE",
      });
      setMessage("Usuário cadastrado com sucesso!");
      setForm({ username: "", password: "" });
    } catch (error) {
      setMessage("Erro ao cadastrar. Verifique os dados.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Crie sua conta</h2>
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
            Cadastrar
          </Button>
        </form>

        {message && (
            <p className="mt-4 text-center text-sm text-green-600 font-medium"> 
                {message}
            </p>
        )}

<p className="mt-6 text-center text-sm text-gray-600">
  Já tem uma conta?{" "}
  <a href="/login" className="text-blue-600 hover:underline font-medium">
    Faça login
  </a>
</p>
      </div>
    </div>
  );
}
