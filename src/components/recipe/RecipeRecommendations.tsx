// src/components/recipe/RecipeRecommendations.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Recipe } from '@/types';
import { addToHistory } from '@/lib/services/history';
import { statsEventEmitter } from '@/lib/services/stats';
import { saveShareHistory } from '@/lib/services/share';
import { Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContexts';
import { useImage } from '@/contexts/ImageContext';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const RECIPE_API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY as string;
const RECIPE_API_URL = process.env.NEXT_PUBLIC_RECIPE_API_URL as string;

if (!RECIPE_API_KEY || !RECIPE_API_URL) {
  throw new Error('Recipe API configuration is missing');
}

// Fungsi yang bisa digunakan komponen lain
export async function generateRecipes(ingredients: string[]): Promise<Recipe[]> {
  const response = await axios.post(
    RECIPE_API_URL,
    { ingredients },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': RECIPE_API_KEY
      }
    }
  );

  if (!response.data || !response.data.recipes || !Array.isArray(response.data.recipes)) {
    throw new Error('Format response tidak valid');
  }

  return response.data.recipes.map((recipe: Recipe) => ({
    ...recipe,
    id: uuidv4()
  }));
}

interface RecipeRecommendationsProps {
  ingredients: { name: string; confidence: number }[];
}

export default function RecipeRecommendations({ ingredients }: RecipeRecommendationsProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();
  const { showResults, analysisResults, setAnalysisResults, setShowResults } = useImage();

  // Fungsi untuk berbagi resep
  const handleShare = async (recipe: Recipe) => {
    try {
      await navigator.share({
        title: recipe.name,
        text: `Cek resep ${recipe.name} ini!`,
        url: window.location.href
      });
      if (user) {
        await saveShareHistory(recipe, user.id, 'web_share');
        statsEventEmitter.emit();
      }
      toast.success('Berhasil membuka menu berbagi');
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        toast.error('Gagal membagikan resep');
      }
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!ingredients.length || !user || analysisResults || !showResults) return;

      setIsLoading(true);
      setError(null);

      try {
        // Filter bahan berdasarkan confidence dan bersihkan dari kata-kata umum
        const excludedWords = [
          'food', 'ingredient', 'natural', 'local', 'whole', 
          'super', 'vegetarian', 'diet', 'accessory', 'produce', 
          'fresh', 'healthy', 'organic', 'group', 'staple'
        ];

        // Hanya tampilkan hasil analisis dulu
        const detectedIngredients = ingredients
          .filter(ing => ing.confidence > 0.7)
          .map(ing => {
            const name = ing.name.toLowerCase().trim();
            let cleanName = name;
            excludedWords.forEach(word => {
              cleanName = cleanName.replace(word, '').trim();
            });
            return cleanName;
          })
          .filter(name => name !== '');

        console.log('Bahan yang terdeteksi:', ingredients.map(ing => ing.name));
        console.log('Bahan yang akan ditampilkan:', detectedIngredients);

        if (detectedIngredients.length === 0) {
          throw new Error('Tidak dapat mengenali bahan makanan spesifik. Coba foto ulang dengan fokus pada bahan makanan.');
        }

        // Simpan hasil analisis tanpa generate resep dulu
        setAnalysisResults({
          labels: detectedIngredients,
          recipes: [], // Kosong karena belum generate resep
          timestamp: new Date().toISOString()
        });
        setShowResults(true);

      } catch (err: any) {
        console.error('Analysis Error:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Gagal menganalisis gambar. Silakan coba lagi.';
        setError(errorMessage);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [ingredients, user, analysisResults, showResults, setAnalysisResults, setShowResults]);

  // Fungsi untuk generate resep berdasarkan bahan yang dipilih
  const handleGenerateRecipe = async (selectedIngredients: string[]) => {
    if (!selectedIngredients.length) {
      toast.error('Pilih bahan terlebih dahulu');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        RECIPE_API_URL,
        { ingredients: selectedIngredients },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': RECIPE_API_KEY
          }
        }
      );

      console.log('API Response:', response.data);

      if (!response.data || !response.data.recipes || !Array.isArray(response.data.recipes)) {
        throw new Error('Tidak ada resep yang tersedia untuk bahan ini');
      }

      const recipesWithIds = response.data.recipes.map((recipe: Recipe) => ({
        ...recipe,
        id: uuidv4()
      }));

      if (recipesWithIds.length === 0) {
        throw new Error('Tidak ada resep yang sesuai dengan bahan yang dipilih');
      }

      setRecipes(recipesWithIds);
      if (user) {
        await addToHistory(recipesWithIds[0], ingredients, user.id);
      }
      
      // Update analysis results dengan resep baru
      if (analysisResults) {
        setAnalysisResults({
          ...analysisResults,
          recipes: recipesWithIds
        });
      }

      toast.success('Resep berhasil digenerate!');
    } catch (err: any) {
      console.error('Recipe Generation Error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Gagal menghasilkan resep. Silakan coba lagi.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        <span className="ml-2 text-sm text-gray-600">
          {recipes.length ? 'Mengambil rekomendasi resep...' : 'Menganalisis bahan...'}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Tampilkan hasil analisis dan form pemilihan bahan
  if (analysisResults && !recipes.length) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bahan Terdeteksi:</h2>
          <div className="space-y-4">
            {analysisResults.labels.map((label, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`ingredient-${index}`}
                  className="mr-2"
                  onChange={(e) => {
                    const selected = analysisResults.labels.filter((_, i) => {
                      if (i === index) return e.target.checked;
                      const checkbox = document.getElementById(`ingredient-${i}`) as HTMLInputElement;
                      return checkbox?.checked || false;
                    });
                    if (selected.length > 0) {
                      handleGenerateRecipe(selected);
                    }
                  }}
                />
                <label htmlFor={`ingredient-${index}`} className="text-gray-700">
                  {label}
                </label>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Pilih bahan yang ingin digunakan untuk generate resep
          </p>
        </div>
      </div>
    );
  }

  // Tampilkan resep jika sudah digenerate
  if (!recipes.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tidak ada rekomendasi resep untuk bahan-bahan ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">
        Rekomendasi Resep
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
          >
            {recipe.image && (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="object-cover w-full h-48"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {recipe.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare(recipe)}
                    disabled={isSharing}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="Bagikan resep"
                  >
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              {recipe.description && (
                <p className="text-sm text-gray-500 mb-4">
                  {recipe.description}
                </p>
              )}
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Bahan-bahan:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cara Memasak:</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                    {recipe.instructions.map((instruction, idx) => (
                      <li key={idx} className="pl-1">
                        <span className="ml-2">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}