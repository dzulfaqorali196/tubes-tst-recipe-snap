'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContexts';
import RecipeRecommendations from '@/components/recipe/RecipeRecommendations';

interface Ingredient {
  name: string;
  confidence: number;
}

export default function AnalysisResults() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('image_analysis')
          .select('ingredients')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        if (data?.ingredients) {
          setIngredients(data.ingredients);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestAnalysis();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        <span className="ml-2 text-sm text-gray-600">Memuat hasil analisis...</span>
      </div>
    );
  }

  if (!ingredients.length) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Hasil Analisis Gambar
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {ingredient.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Tingkat keyakinan: {Math.round(ingredient.confidence * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RecipeRecommendations ingredients={ingredients} />
    </div>
  );
}