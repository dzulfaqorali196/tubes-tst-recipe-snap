'use client';

import axios from 'axios';
import { Recipe } from '@/types';

const RECIPE_API_URL = process.env.NEXT_PUBLIC_RECIPE_API_URL as string;
const RECIPE_API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY as string;

console.log('Debug - RECIPE_API_URL:', RECIPE_API_URL);
console.log('Debug - RECIPE_API_KEY exists:', !!RECIPE_API_KEY);

if (!RECIPE_API_URL || !RECIPE_API_KEY) {
  throw new Error('Recipe API configuration is missing');
}

export async function generateRecipes(ingredients: string[]): Promise<Recipe[]> {
  try {
    console.log('Mengirim request ke API dengan bahan:', ingredients);
    const { data } = await axios.post(
      RECIPE_API_URL,
      { ingredients },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': RECIPE_API_KEY
        }
      }
    );

    if (!data || !data.recipes || !Array.isArray(data.recipes)) {
      console.error('Format response API tidak valid:', data);
      return [];
    }

    return data.recipes;
  } catch (error) {
    console.error('Recipe Generation Error:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Response:', error.response?.data);
    }
    return [];
  }
} 