import { NextResponse } from 'next/server';
import axios from 'axios';

const RECIPE_API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY;
const RECIPE_API_URL = 'https://smart-health-tst.up.railway.app/api/recipes';

if (!RECIPE_API_KEY) {
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

    // Langsung return data dari API external
    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error('Recipe Generation Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Gagal menghasilkan resep. Silakan coba lagi.' },
      { status: 500 }
    );
  }
} 