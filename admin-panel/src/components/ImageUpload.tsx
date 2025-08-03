import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { API_CONFIG } from '@/config/api.config';
import axios from 'axios';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  resetTrigger?: number; 
}

export default function ImageUpload({ onImageUploaded, resetTrigger }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      setPreviewUrl(null);
      setUploadError(null);
    }
  }, [resetTrigger]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
 
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${API_CONFIG.API_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY)}`,
          },
        }
      );

      const imageUrl = response.data;
      
      onImageUploaded(imageUrl);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setUploadError('Falha ao fazer upload da imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  }, [onImageUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        
        {previewUrl ? (
          <div className="flex flex-col items-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-40 max-w-full mb-2 rounded-md" 
            />
            <p className="text-sm text-gray-500">
              {isDragActive ? 'Solte a imagem aqui...' : 'Clique para trocar ou arraste uma nova imagem'}
            </p>
          </div>
        ) : (
          <div className="py-4">
            {isDragActive ? (
              <p>Solte a imagem aqui...</p>
            ) : (
              <>
                <p className="mb-2">Arraste e solte uma imagem aqui, ou clique para selecionar</p>
                <p className="text-sm text-gray-500">Apenas arquivos de imagem (JPG, PNG, GIF)</p>
              </>
            )}
          </div>
        )}
      </div>

      {isUploading && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Enviando imagem...
        </div>
      )}

      {uploadError && (
        <div className="mt-2 text-center text-sm text-red-500">
          {uploadError}
        </div>
      )}

      {previewUrl && (
        <div className="mt-2 flex justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setPreviewUrl(null);
              onImageUploaded('');
            }}
            type="button"
          >
            Remover imagem
          </Button>
        </div>
      )}
    </div>
  );
}