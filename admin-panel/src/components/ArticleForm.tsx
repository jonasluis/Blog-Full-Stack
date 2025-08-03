import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authService } from "@/services/auth.service";
import { apiService } from "@/services/api.service";
import ImageUpload from "@/components/ImageUpload";

interface PostFormData {
  title: string;
  author: string;
  tags: string;
  summary: string;
  content: string;
  coverImageUrl: string;
}

export default function ArticleForm() {
  const [form, setForm] = useState<PostFormData>({
    title: "",
    author: "",
    tags: "",
    summary: "",
    content: "",
    coverImageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [resetImageUpload, setResetImageUpload] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const tokenParam = hashParams.get('token');
      
      if (tokenParam) {
        authService.setToken(tokenParam);
        
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
    
    const username = authService.getUserName();
    if (username) {
      setForm(prev => ({ ...prev, author: username }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.author || !form.content) {
      setMessage({
        text: "Por favor, preencha pelo menos título, autor e conteúdo",
        type: "error"
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      await apiService.createPost({
        ...form,
        tags: form.tags.split(",").map(tag => tag.trim()),
      });

      setMessage({
        text: "Artigo criado com sucesso!",
        type: "success"
      });
      
      setForm({
        title: "",
        author: form.author, 
        tags: "",
        summary: "",
        content: "",
        coverImageUrl: "",
      });
      
      setResetImageUpload(prev => prev + 1);
    } catch (error) {
      console.error("Erro ao criar artigo:", error);
      
      setMessage({
        text: `Erro: ${error.response?.data?.message || error.message || 'Falha ao criar artigo'}`,
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold">Criar Artigo</h1>

      {message && (
        <div className={`p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" value={form.title} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="author">Autor</Label>
        <Input id="author" name="author" value={form.author} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input id="tags" name="tags" value={form.tags} onChange={handleChange} placeholder="tecnologia, programação, web" />
      </div>

      <div>
        <Label htmlFor="summary">Resumo</Label>
        <Textarea 
          id="summary" 
          name="summary" 
          value={form.summary} 
          onChange={handleChange} 
          placeholder="Um breve resumo do artigo..."
        />
      </div>

      <div>
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea 
          id="content" 
          name="content" 
          value={form.content} 
          onChange={handleChange} 
          className="min-h-[200px]"
          required
        />
      </div>

      <div>
        <Label htmlFor="coverImage">Imagem de Capa</Label>
        <div className="mt-2">
          <ImageUpload 
            onImageUploaded={(imageUrl) => {
              setForm(prev => ({ ...prev, coverImageUrl: imageUrl }));
            }}
            resetTrigger={resetImageUpload}
          />
        </div>
        {form.coverImageUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">URL da imagem: {form.coverImageUrl}</p>
          </div>
        )}
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Publicando...' : 'Publicar Artigo'}
      </Button>
    </div>
  );
}