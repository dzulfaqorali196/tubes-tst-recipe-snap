'use client';

import React, { useEffect, useState } from 'react';
import { analyzeAndGenerateRecipes } from '@/lib/services/recipes';
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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!labels || labels.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const generatedRecipes = await analyzeAndGenerateRecipes(labels);
        setRecipes(generatedRecipes);
      } catch (err: any) {
        setError(err.message || 'Failed to generate recipes');
        toast.error(err.message || 'Failed to generate recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [labels]);

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-600">Generating recipes...</p>
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Detected Items:</h2>
      <ul className="mb-6">
        {labels.map((label, index) => (
          <li key={index} className="text-gray-700">{label}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mb-4">Recommended Recipes:</h2>
      {recipes.length > 0 ? (
        <div className="space-y-6">
          {recipes.map((recipe, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              
              <h4 className="font-semibold mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside mb-4">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="text-gray-700">{ingredient}</li>
                ))}
              </ul>

              {recipe.instructions && (
                <>
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  <ol className="list-decimal list-inside">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="text-gray-700 mb-1">{step}</li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No recipes found for the detected items.</p>
      )}
    </div>
  );
}