'use client';

import axios from 'axios';

export async function generateRecipes(ingredients: string[]) {
  try {
    const { data } = await axios.post('/api/recipes/generate', { ingredients });
    return data.recipes;
  } catch (error) {
    console.error('Recipe Generation Error:', error);
    throw error;
  }
}

export async function analyzeAndGenerateRecipes(labels: string[]) {
  try {
    // Filter out non-food labels and prepare ingredients
    const foodLabels = labels.filter(label => 
      ['food', 'dish', 'cuisine', 'meal', 'ingredient'].some(term => 
        label.toLowerCase().includes(term)
      )
    );

    if (foodLabels.length === 0) {
      throw new Error('No food items detected in the image');
    }

    // Generate recipes based on detected food items
    const recipes = await generateRecipes(foodLabels);
    return recipes;
  } catch (error) {
    console.error('Analysis and Recipe Generation Error:', error);
    throw error;
  }
} 