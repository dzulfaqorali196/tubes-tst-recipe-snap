'use client';

import axios from 'axios';
import { Recipe } from '@/types';

// Ambil konfigurasi dari environment variables
const RECIPE_API_URL = process.env.NEXT_PUBLIC_RECIPE_API_URL;
const RECIPE_API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY;

if (!RECIPE_API_URL || !RECIPE_API_KEY) {
  console.error('Recipe API configuration is missing');
}

const axiosInstance = axios.create({
  baseURL: RECIPE_API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-Key': RECIPE_API_KEY
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
      if (!RECIPE_API_URL || !RECIPE_API_KEY) {
        throw new Error('Konfigurasi API tidak lengkap. Silakan hubungi administrator.');
      }

      console.log(`Attempt ${attempt + 1}/${MAX_RETRIES} - Generating recipes for:`, ingredients);

      const { data } = await axiosInstance.post('/generate', {
        ingredients: ingredients,
        timestamp: new Date().toISOString()
      });

      if (!data || !data.recipes || !Array.isArray(data.recipes)) {
        console.error('Invalid API response format:', data);
        throw new Error('Format response API tidak valid');
      }

      return data.recipes;

    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error);

      if (axios.isAxiosError(error)) {
        // Log error tanpa menampilkan informasi sensitif
        console.error('API Error:', {
          status: error.response?.status,
          message: error.message
        });

        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new Error('Terjadi masalah autentikasi. Silakan coba lagi nanti.');
        }
      }

      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        await sleep(delay);
      } else {
        throw new Error('Gagal generate resep setelah beberapa percobaan. Silakan coba lagi nanti.');
      }
    }
  }

  throw new Error('Terjadi kesalahan yang tidak terduga');
} 