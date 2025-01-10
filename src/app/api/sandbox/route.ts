import { NextResponse } from 'next/server';

type MockResponseType = {
  [key: string]: {
    success: boolean;
    data: any;
  }
};

const mockResponses: MockResponseType = {
  '/api/recipes/generate': {
    success: true,
    data: {
      recipes: [
        {
          id: 1,
          name: "Nasi Goreng Spesial",
          ingredients: ["bawang", "tomat", "cabai"],
          instructions: [
            "1. Tumis bumbu halus hingga harum",
            "2. Masukkan nasi dan aduk rata",
            "3. Tambahkan kecap dan bumbu lainnya"
          ]
        }
      ]
    }
  },
  '/api/recipes': {
    success: true,
    data: {
      recipes: [
        {
          id: 1,
          name: "Nasi Goreng",
          ingredients: ["nasi", "bawang", "telur"],
          thumbnail: "https://example.com/nasi-goreng.jpg"
        },
        {
          id: 2,
          name: "Mie Goreng",
          ingredients: ["mie", "bawang", "sayur"],
          thumbnail: "https://example.com/mie-goreng.jpg"
        }
      ],
      pagination: {
        total: 10,
        page: 1,
        limit: 10
      }
    }
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, method, data } = body;

    // Simulasi delay untuk menunjukkan loading state
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Cek apakah endpoint tersedia
    if (!mockResponses[endpoint]) {
      return NextResponse.json(
        { error: 'Endpoint tidak ditemukan' },
        { status: 404 }
      );
    }

    // Return mock response sesuai endpoint
    return NextResponse.json(mockResponses[endpoint]);
  } catch (error) {
    console.error('Sandbox error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 