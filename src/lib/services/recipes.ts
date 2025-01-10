'use client';

import axios from 'axios';

export async function generateRecipes(ingredients: string[]) {
  try {
    console.log('Sending request to generate recipes with ingredients:', ingredients);
    const { data } = await axios.post('/api/recipes/generate', { 
      ingredients: ingredients 
    });
    console.log('Recipe API response:', data);
    return data.recipes || [];
  } catch (error) {
    console.error('Recipe Generation Error:', error);
    throw new Error('Gagal menghasilkan resep. Silakan coba lagi.');
  }
}

export async function analyzeAndGenerateRecipes(labels: string[]) {
  try {
    // Filter out non-food labels and prepare ingredients
    const foodLabels = labels.filter(label => 
      !['food', 'ingredient', 'natural foods', 'local food', 'whole food', 'superfood', 'vegetarian food'].includes(label.toLowerCase())
    );

    console.log('Filtered food labels:', foodLabels);

    if (foodLabels.length === 0) {
      throw new Error('Tidak dapat mendeteksi bahan makanan spesifik dalam gambar');
    }

    // Generate recipes based on detected food items
    const recipes = await generateRecipes(foodLabels);
    return recipes;
  } catch (error) {
    console.error('Analysis and Recipe Generation Error:', error);
    throw error;
  }
} 