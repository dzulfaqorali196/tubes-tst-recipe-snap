'use client';

import React, { useEffect, useState } from 'react';
import { analyzeAndGenerateRecipes } from '@/lib/services/recipes';
import { useImage } from '@/contexts/ImageContext';
import toast from 'react-hot-toast';

interface AnalysisResultsProps {
  labels: string[];
}

interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

export default function AnalysisResults({ labels }: AnalysisResultsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { analysisResults } = useImage();

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!labels || labels.length === 0) return;
      if (analysisResults?.labels.join(',') === labels.join(',')) return;

      setLoading(true);
      setError(null);

      try {
        const generatedRecipes = await analyzeAndGenerateRecipes(labels);
        // Results will be saved to context by ImageUploader
      } catch (err: any) {
        setError(err.message || 'Failed to generate recipes');
        toast.error(err.message || 'Failed to generate recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [labels, analysisResults]);

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-center text-black">Generating recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  if (!analysisResults) return null;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Detected Items:</h2>
      <ul className="mb-6">
        {analysisResults.labels.map((label, index) => (
          <li key={index} className="text-black">{label}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mb-4 text-black">Recommended Recipes:</h2>
      {analysisResults.recipes.length > 0 ? (
        <div className="space-y-6">
          {analysisResults.recipes.map((recipe: Recipe, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-black">{recipe.name}</h3>
              <p className="text-black mb-4">{recipe.description}</p>
              
              <h4 className="font-semibold mb-2 text-black">Ingredients:</h4>
              <ul className="list-disc list-inside mb-4">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="text-black">{ingredient}</li>
                ))}
              </ul>

              {recipe.instructions && (
                <>
                  <h4 className="font-semibold mb-2 text-black">Instructions:</h4>
                  <ol className="list-decimal list-inside">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="text-black mb-1">{step}</li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-black">No recipes found for the detected items.</p>
      )}
    </div>
  );
}