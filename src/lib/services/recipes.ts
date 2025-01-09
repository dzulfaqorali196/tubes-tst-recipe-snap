'use client';

import axios from 'axios';
import { Recipe } from '@/types';

// Fallback values untuk production
const RECIPE_API_URL = process.env.NEXT_PUBLIC_RECIPE_API_URL || 'https://smart-health-tst.up.railway.app/api/recipes';
const RECIPE_API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY || 'a75f3b2e9c1d6h8j4k2m7n5p3q6r9s1t4u8v2w6x3y5z0';

console.log('Debug - All env:', {
  NEXT_PUBLIC_RECIPE_API_URL: process.env.NEXT_PUBLIC_RECIPE_API_URL,
  NODE_ENV: process.env.NODE_ENV,
  USING_FALLBACK: !process.env.NEXT_PUBLIC_RECIPE_API_URL
});

// Tambahan logging
console.log('Debug - Raw RECIPE_API_URL:', process.env.NEXT_PUBLIC_RECIPE_API_URL);
console.log('Debug - Raw RECIPE_API_KEY:', process.env.NEXT_PUBLIC_RECIPE_API_KEY);
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