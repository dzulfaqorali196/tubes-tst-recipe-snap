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

    // Format response data sederhana
    const recipes = [{
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

    console.log('Generated recipes:', recipes);

    return NextResponse.json({
      success: true,
      recipes: recipes
    });
  } catch (error: any) {
    console.error('Recipe Generation Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { error: 'Gagal menghasilkan resep. Silakan coba lagi.' },
      { status: 500 }
    );
  }
} 