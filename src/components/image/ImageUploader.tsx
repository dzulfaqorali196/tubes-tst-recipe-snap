// src/components/image/ImageUploader.tsx
'use client';

import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContexts';
import { useImage } from '@/contexts/ImageContext';
import { analyzeAndGenerateRecipes } from '@/lib/services/recipes';
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
    setShowResults,
    setAnalysisResults,
    clearAnalysis
  } = useImage();
  const [isUploading, setIsUploading] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  const supabase = createClient();

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        console.log('File selected:', file.name);
        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
          toast.error('Mohon pilih file gambar yang valid');
          return;
        }
        
        // Buat URL preview
        const objectUrl = URL.createObjectURL(file);
        console.log('Preview URL created:', objectUrl);
        
        // Reset state sebelumnya
        clearAnalysis();
        
        // Update state
        setSelectedImage(file);
        setPreviewUrl(objectUrl);
        setShowResults(false);
        
        console.log('Image state updated');
      } catch (error) {
        console.error('Error handling image selection:', error);
        toast.error('Gagal memuat gambar');
      }
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      try {
        console.log('File dropped:', file.name);
        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
          toast.error('Mohon pilih file gambar yang valid');
          return;
        }
        
        // Buat URL preview
        const objectUrl = URL.createObjectURL(file);
        console.log('Preview URL created:', objectUrl);
        
        // Reset state sebelumnya
        clearAnalysis();
        
        // Update state
        setSelectedImage(file);
        setPreviewUrl(objectUrl);
        setShowResults(false);
        
        console.log('Image state updated');
      } catch (error) {
        console.error('Error handling dropped image:', error);
        toast.error('Gagal memuat gambar');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveImage = () => {
    console.log('Removing image');
    // Hapus URL preview untuk mencegah memory leak
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    clearAnalysis();
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

      console.log('Vision API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Vision API error:', errorData);
        throw new Error(errorData.error || 'Gagal menganalisis gambar');
      }

      const data = await response.json();
      console.log('Vision API response data:', data);

      if (!data.success || !data.data) {
        throw new Error('Tidak ada hasil analisis yang diterima');
      }

      const { ingredients } = data.data;
      const detectedLabels = ingredients.map((ing: any) => ing.name);
      console.log('Detected labels:', detectedLabels);
      setLabels(detectedLabels);

      // Generate recipes
      console.log('Generating recipes...');
      let recipes;
      try {
        recipes = await analyzeAndGenerateRecipes(detectedLabels);
        console.log('Generated recipes:', recipes);
      } catch (recipeError) {
        console.error('Recipe generation error:', recipeError);
        throw new Error('Gagal menghasilkan resep dari bahan yang terdeteksi');
      }

      if (!recipes || recipes.length === 0) {
        throw new Error('Tidak ada resep yang ditemukan untuk bahan-bahan ini');
      }

      // Save analysis results to context
      const timestamp = new Date().toISOString();
      setAnalysisResults({
        labels: detectedLabels,
        recipes,
        timestamp
      });

      // Upload image to storage
      console.log('Uploading image to Supabase storage...');
      const fileName = `${Date.now()}-${selectedImage.name}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('food-images')
        .upload(`public/${fileName}`, selectedImage, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Error mengunggah gambar: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('food-images')
        .getPublicUrl(`public/${fileName}`);

      console.log('Image public URL:', publicUrl);

      // Save to image_analysis table
      console.log('Saving to image_analysis...');
      const { error: analysisError } = await supabase
        .from('image_analysis')
        .insert({
          user_id: user.id,
          image_path: `public/${fileName}`,
          image_url: publicUrl,
          ingredients: ingredients,
          created_at: timestamp
        });

      if (analysisError) {
        console.error('Analysis save error:', analysisError);
        throw new Error(`Error menyimpan analisis: ${analysisError.message}`);
      }

      // Save to recipe_history table
      console.log('Saving to recipe_history...');
      const { error: historyError } = await supabase
        .from('recipe_history')
        .insert({
          user_id: user.id,
          recipe_data: recipes,
          ingredients: ingredients,
          created_at: timestamp
        });

      if (historyError) {
        console.error('History save error:', historyError);
        throw new Error(`Error menyimpan riwayat: ${historyError.message}`);
      }

      console.log('All operations completed successfully');
      toast.success('Analisis gambar selesai');
      setShowResults(true);
      onAnalysisComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      setShowResults(false);
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
                className="max-h-64 mx-auto rounded-lg object-contain"
                onError={() => {
                  console.error('Error loading image preview');
                  toast.error('Gagal menampilkan preview gambar');
                }}
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

      {showResults && <AnalysisResults labels={labels} />}
    </div>
  );
}