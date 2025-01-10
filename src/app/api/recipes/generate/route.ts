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

    console.log('Recipe API response:', response.data);

    return NextResponse.json({
      success: true,
      recipes: response.data
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