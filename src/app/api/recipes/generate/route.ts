import { NextResponse } from 'next/server';
import axios from 'axios';

const RECIPE_API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY as string;
const RECIPE_API_URL = process.env.NEXT_PUBLIC_RECIPE_API_URL as string;

if (!RECIPE_API_KEY || !RECIPE_API_URL) {
  throw new Error('Recipe API configuration is missing');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ingredients = body.ingredients;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Invalid ingredients data' },
        { status: 400 }
      );
    }

    console.log('Generating recipes for ingredients:', ingredients);

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

    console.log('Recipe API response:', response.data);

    if (!response.data || !response.data.recipes) {
      throw new Error('Invalid response format from recipe API');
    }

    return NextResponse.json({
      success: true,
      recipes: response.data.recipes
    });

  } catch (error: any) {
    console.error('Recipe Generation Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal menghasilkan resep. Silakan coba lagi.' 
      },
      { status: 500 }
    );
  }
} 