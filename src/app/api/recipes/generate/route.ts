import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ingredients } = body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Invalid ingredients data' },
        { status: 400 }
      );
    }

    console.log('Generating recipes for ingredients:', ingredients);

    const response = await axios.post(
      'https://smart-health-tst.up.railway.app/api/recipes',
      { ingredients },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_RECIPE_API_KEY || ''
        },
        timeout: 10000 // 10 seconds timeout
      }
    );

    console.log('Recipe API raw response:', response.data);

    // Pastikan response.data adalah array
    const recipes = Array.isArray(response.data) ? response.data : [response.data];
    
    // Format resep sesuai dengan struktur yang diharapkan
    const formattedRecipes = recipes.map(recipe => {
      // Jika recipe adalah string, buat objek resep baru
      if (typeof recipe === 'string') {
        return {
          name: recipe,
          description: '',
          ingredients: ingredients,
          instructions: []
        };
      }

      // Jika recipe adalah objek, gunakan properti yang ada
      return {
        name: recipe.name || recipe.title || recipe.recipe_name || 'Untitled Recipe',
        description: recipe.description || recipe.desc || '',
        ingredients: recipe.ingredients || ingredients || [],
        instructions: recipe.instructions || recipe.steps || []
      };
    });

    console.log('Formatted recipes:', formattedRecipes);

    return NextResponse.json({
      success: true,
      recipes: formattedRecipes
    });
  } catch (error: any) {
    console.error('Recipe Generation Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401 || error.response?.status === 403) {
      return NextResponse.json(
        { error: 'API key tidak valid atau tidak ditemukan' },
        { status: 401 }
      );
    }

    if (error.code === 'ECONNABORTED') {
      return NextResponse.json(
        { error: 'Waktu permintaan habis. Silakan coba lagi.' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: 'Gagal menghasilkan resep. Silakan coba lagi.' },
      { status: 500 }
    );
  }
} 