// src/components/image/ImageUploader.tsx
'use client';

import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContexts';
import { useImage } from '@/contexts/ImageContext';
import toast from 'react-hot-toast';
import AnalysisResults from '../analysis/AnalysisResults';

interface ImageUploaderProps {
  onAnalysisComplete?: () => void;
}

export default function ImageUploader({ onAnalysisComplete }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const {
    selectedImage,
    previewUrl,
    showResults,
    setSelectedImage,
    setPreviewUrl,
    setShowResults
  } = useImage();
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowResults(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowResults(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setShowResults(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !user) {
      toast.error('Pilih gambar terlebih dahulu');
      return;
    }

    setIsUploading(true);
    try {
      console.log('Starting image upload process...');
      
      // Call Vision API first
      console.log('Calling Vision API...');
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('/api/recipes/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menganalisis gambar');
      }

      const data = await response.json();
      console.log('Vision API response:', data);

      if (!data.success || !data.data) {
        throw new Error('Tidak ada hasil analisis yang diterima');
      }

      const { ingredients } = data.data;

      // Upload image to storage after successful analysis
      console.log('Uploading image to Supabase storage...');
      const fileName = `${Date.now()}-${selectedImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from('food-images')
        .upload(`public/${fileName}`, selectedImage, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Error mengunggah gambar: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('food-images')
        .getPublicUrl(`public/${fileName}`);

      console.log('Image uploaded successfully. Public URL:', publicUrl);

      // Save analysis result
      console.log('Saving analysis result to database...');
      const { error: dbError } = await supabase
        .from('image_analysis')
        .insert({
          user_id: user.id,
          image_path: `public/${fileName}`,
          image_url: publicUrl,
          ingredients: ingredients,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Error menyimpan hasil: ${dbError.message}`);
      }

      toast.success('Analisis gambar selesai');
      setShowResults(true);
      onAnalysisComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan saat memproses gambar');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            ref={fileInputRef}
            title="Pilih gambar untuk diunggah"
          />
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Hapus gambar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Klik atau seret gambar ke sini untuk mengunggah
              </p>
            </div>
          )}
        </div>

        {selectedImage && (
          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Menganalisis...' : 'Analisis Gambar'}
            </button>
          </div>
        )}
      </div>

      {showResults && <AnalysisResults />}
    </div>
  );
}