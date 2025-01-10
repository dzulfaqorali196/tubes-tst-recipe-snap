'use client';

import axios from 'axios';
import { Recipe } from '@/types';

const RECIPE_API_URL = process.env.NEXT_PUBLIC_RECIPE_API_URL;
const RECIPE_API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY;

const axiosInstance = axios.create({
  baseURL: RECIPE_API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': RECIPE_API_KEY,
  }
});

// Retry logic
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateRecipes(ingredients: string[]): Promise<Recipe[]> {
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      console.log(`Attempt ${attempt + 1}/${MAX_RETRIES} - Generating recipes for:`, ingredients);
      
      if (!RECIPE_API_URL || !RECIPE_API_KEY) {
        throw new Error('Recipe API configuration is missing');
      }

      const { data } = await axiosInstance.post('', {
        ingredients,
        timestamp: new Date().toISOString()
      });

      if (!data || !data.recipes || !Array.isArray(data.recipes)) {
        console.error('Invalid API response format:', data);
        throw new Error('Format response API tidak valid');
      }

      console.log('Recipes generated successfully:', data.recipes.length);
      return data.recipes;

    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error);

      if (axios.isAxiosError(error)) {
        console.error('API Error Details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });

        // Jika error 401/403, tidak perlu retry
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new Error('API key tidak valid atau tidak memiliki akses');
        }
      }

      // Jika masih ada retry tersisa, tunggu sebelum mencoba lagi
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`Waiting ${delay}ms before retry...`);
        await sleep(delay);
      } else {
        throw new Error('Gagal generate resep setelah beberapa percobaan');
      }
    }
  }

  throw new Error('Unexpected error in recipe generation');
} 