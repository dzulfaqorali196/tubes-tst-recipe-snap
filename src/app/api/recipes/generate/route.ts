import { NextResponse } from 'next/server';
import axios from 'axios';

const RECIPE_API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY as string;
const RECIPE_API_URL = process.env.NEXT_PUBLIC_RECIPE_API_URL as string;

if (!RECIPE_API_KEY || !RECIPE_API_URL) {
  throw new Error('Recipe API configuration is missing');
}

export async function POST(request: Request) {
  let ingredients: string[] = [];
  
  try {
    const body = await request.json();
    ingredients = body.ingredients;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Invalid ingredients data' },
        { status: 400 }
      );
    }

    console.log('Generating recipes for ingredients:', ingredients);

    // Pastikan untuk menggunakan API external dengan API Key
    const response = await axios.post(
      RECIPE_API_URL,
      { ingredients },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': RECIPE_API_KEY
        }
      }
    );

    console.log('Recipe API raw response:', response.data);

    // Pastikan response.data adalah array
    let recipes = Array.isArray(response.data) ? response.data : [response.data];
    
    // Jika recipes kosong, berikan resep default
    if (!recipes || recipes.length === 0) {
      recipes = [{
        name: "Resep dari " + ingredients.join(", "),
        description: "Resep yang dibuat menggunakan bahan-bahan yang terdeteksi",
        ingredients: ingredients,
        instructions: [
          "1. Siapkan semua bahan",
          "2. Olah bahan sesuai kebutuhan",
          "3. Masak dengan api sedang",
          "4. Sajikan selagi hangat"
        ]
      }];
    }

    console.log('Final recipes:', recipes);

    return NextResponse.json({
      success: true,
      recipes: recipes
    });
  } catch (error: any) {
    console.error('Recipe Generation Error:', error.response?.data || error.message);
    
    // Jika error dari API external, berikan resep default
    const defaultRecipe = [{
      name: "Resep Default",
      description: "Resep default karena terjadi error saat mengakses API",
      ingredients: ingredients,
      instructions: [
        "1. Siapkan semua bahan",
        "2. Olah bahan sesuai kebutuhan",
        "3. Masak dengan api sedang",
        "4. Sajikan selagi hangat"
      ]
    }];

    return NextResponse.json({
      success: true,
      recipes: defaultRecipe
    });
  }
} 