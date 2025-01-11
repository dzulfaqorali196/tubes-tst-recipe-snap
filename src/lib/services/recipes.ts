'use client';

import axios from 'axios';

interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

export async function generateRecipes(ingredients: string[]): Promise<Recipe[]> {
  try {
    console.log('Sending request to generate recipes with ingredients:', ingredients);
    const { data } = await axios.post('/api/recipes/generate', { 
      ingredients: ingredients 
    });
    console.log('Recipe API response:', data);
    
    if (!data.success || !data.recipes) {
      console.error('Invalid recipe data format:', data);
      throw new Error('Format resep tidak valid');
    }

    return data.recipes;
  } catch (error) {
    console.error('Recipe Generation Error:', error);
    throw new Error('Gagal menghasilkan resep. Silakan coba lagi.');
  }
}

export async function analyzeAndGenerateRecipes(labels: string[]): Promise<Recipe[]> {
  try {
    // Daftar kata-kata yang akan difilter keluar (kata-kata yang terlalu umum)
    const excludedLabels = [
      'food', 'ingredient', 'natural foods', 'local food', 'whole food', 
      'superfood', 'vegetarian food', 'diet food', 'accessory fruit',
      'produce', 'natural', 'fresh', 'healthy', 'organic'
    ];

    // Filter label yang terlalu umum dan ubah ke lowercase untuk konsistensi
    const foodLabels = labels
      .map(label => label.toLowerCase().trim())
      .filter(label => !excludedLabels.includes(label));

    console.log('Filtered food labels:', foodLabels);

    if (foodLabels.length === 0) {
      throw new Error('Tidak dapat mendeteksi bahan makanan spesifik dalam gambar. Pastikan gambar menunjukkan bahan makanan dengan jelas.');
    }

    // Generate recipes based on detected food items
    const recipes = await generateRecipes(foodLabels);
    console.log('Generated recipes:', recipes);

    if (!recipes || recipes.length === 0) {
      throw new Error('Tidak ada resep yang ditemukan untuk bahan-bahan ini');
    }

    return recipes;
  } catch (error) {
    console.error('Analysis and Recipe Generation Error:', error);
    throw error;
  }
} 