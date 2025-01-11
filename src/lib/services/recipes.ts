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
    
    if (!data.recipes || !Array.isArray(data.recipes)) {
      throw new Error('Format resep tidak valid');
    }

    return data.recipes;
  } catch (error) {
    console.error('Recipe Generation Error:', error);
    throw error;
  }
}

export async function analyzeAndGenerateRecipes(labels: string[]): Promise<Recipe[]> {
  try {
    // Filter bahan makanan yang spesifik
    const foodLabels = labels
      .map(label => label.toLowerCase().trim())
      .filter(label => !['food', 'ingredient', 'natural foods', 'local food', 'whole food', 'superfood', 'vegetarian food'].includes(label));

    console.log('Filtered food labels:', foodLabels);

    if (foodLabels.length === 0) {
      throw new Error('Tidak dapat mendeteksi bahan makanan spesifik dalam gambar');
    }

    // Generate recipes based on detected food items
    const recipes = await generateRecipes(foodLabels);
    
    if (!recipes || recipes.length === 0) {
      throw new Error('Tidak ada resep yang ditemukan untuk bahan-bahan ini');
    }

    return recipes;
  } catch (error) {
    console.error('Analysis and Recipe Generation Error:', error);
    throw error;
  }
} 