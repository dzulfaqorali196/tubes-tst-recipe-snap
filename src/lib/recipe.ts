// src/lib/recipe.ts
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = process.env.SPOONACULAR_API_KEY;

interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
}

export async function getRecipesByIngredients(ingredients: string[]) {
  try {
    const params = new URLSearchParams({
      apiKey: API_KEY!,
      ingredients: ingredients.join(','),
      number: '5',
      ranking: '2',
      ignorePantry: 'true'
    });

    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/findByIngredients?${params}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    const data = await response.json();
    return data as Recipe[];
  } catch (error) {
    console.error('Recipe API error:', error);
    throw error;
  }
}

export async function getRecipeInstructions(recipeId: number) {
  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/${recipeId}/analyzedInstructions?apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch recipe instructions');
    }

    return await response.json();
  } catch (error) {
    console.error('Recipe instructions API error:', error);
    throw error;
  }
}