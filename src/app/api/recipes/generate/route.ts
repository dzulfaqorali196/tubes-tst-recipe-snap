import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ingredients } = body;

    const response = await axios.post(
      'https://smart-health-tst.up.railway.app/api/recipes',
      { ingredients },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_RECIPE_API_KEY
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Recipe Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipes' },
      { status: 500 }
    );
  }
} 