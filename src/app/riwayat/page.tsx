'use client';

import { useAuth } from '@/contexts/AuthContexts';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Navbar from '@/components/layout/Navbar';
import { createClient } from '@/lib/supabase/client';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface RecipeHistory {
  id: string;
  created_at: string;
  recipe_data: any;
  ingredients: any;
}

interface TransformedRecipeHistory {
  id: string;
  created_at: string;
  recipe_data: {
    name: string;
    confidence: number;
    instructions: string[];
  };
  ingredients: string[];
}

export default function RiwayatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<TransformedRecipeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('recipe_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('Raw data from DB:', data); // Debug log

        const transformedData = (data || []).map(item => {
          // Parse recipe_data
          let recipeData = item.recipe_data;
          if (typeof recipeData === 'string') {
            try {
              recipeData = JSON.parse(recipeData);
            } catch (e) {
              console.error('Failed to parse recipe_data:', e);
              recipeData = { title: 'Resep Tanpa Judul', ingredients: [], instructions: [] };
            }
          }

          // Transform to expected format
          const transformed: TransformedRecipeHistory = {
            id: item.id,
            created_at: item.created_at,
            recipe_data: {
              name: recipeData?.title || 'Resep Tanpa Judul',
              confidence: 1.0, // Default confidence
              instructions: Array.isArray(recipeData?.instructions) ? recipeData.instructions : []
            },
            ingredients: Array.isArray(item.ingredients) 
              ? item.ingredients.map((ing: any) => ing.name || ing).filter(Boolean)
              : []
          };

          console.log('Transformed item:', transformed); // Debug log
          return transformed;
        });

        setHistory(transformedData);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Resep</h1>
            
            {history.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada riwayat resep</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleExpand(item.id)}
                    >
                      <div className="flex items-center gap-4">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.recipe_data.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedItems.includes(item.id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedItems.includes(item.id) && (
                      <div className="p-4 border-t">
                        {item.recipe_data.confidence > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500">
                              Tingkat Keyakinan: {(item.recipe_data.confidence * 100).toFixed(1)}%
                            </p>
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Bahan-bahan:</h4>
                          {item.ingredients && item.ingredients.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                              {item.ingredients.map((ingredient: string, index: number) => (
                                <li key={index} className="text-gray-700">
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">Tidak ada bahan yang tercatat</p>
                          )}
                        </div>

                        {item.recipe_data.instructions && item.recipe_data.instructions.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Cara Membuat:</h4>
                            <ol className="list-decimal list-inside space-y-1">
                              {item.recipe_data.instructions.map((step: string, index: number) => (
                                <li key={index} className="text-gray-700">{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 