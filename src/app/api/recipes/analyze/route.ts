import { NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/vision';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export async function POST(request: Request) {
  console.log('Starting image analysis endpoint...');
  
  try {
    // Validasi environment variables
    console.log('Checking environment variables...');
    console.log('Vision Key exists:', !!process.env.AZURE_COMPUTER_VISION_KEY);
    console.log('Vision Endpoint:', process.env.AZURE_COMPUTER_VISION_ENDPOINT);
    
    if (!process.env.AZURE_COMPUTER_VISION_KEY || !process.env.AZURE_COMPUTER_VISION_ENDPOINT) {
      console.error('Azure Computer Vision configuration is missing');
      return NextResponse.json(
        { error: 'Konfigurasi Azure Computer Vision tidak lengkap' },
        { status: 503 }
      );
    }

    // Autentikasi
    console.log('Initializing Supabase client...');
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    console.log('Checking authentication...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: 'Gagal melakukan autentikasi' },
        { status: 401 }
      );
    }
    
    if (!session) {
      console.log('No active session found');
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', session.user.id);

    // Validasi request
    console.log('Processing form data...');
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      console.error('No image found in request');
      return NextResponse.json(
        { error: 'Tidak ada gambar yang diunggah' },
        { status: 400 }
      );
    }

    console.log('Image received:', {
      type: image.type,
      size: image.size,
      name: image.name
    });

    // Validasi tipe file
    if (!image.type.startsWith('image/')) {
      console.error('Invalid file type:', image.type);
      return NextResponse.json(
        { error: 'Format file tidak valid. Harap unggah file gambar.' },
        { status: 400 }
      );
    }

    // Convert image to base64
    console.log('Converting image to base64...');
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString('base64');
    console.log('Image converted to base64, length:', base64Image.length);

    // Analyze image
    try {
      console.log('Starting image analysis...');
      const ingredients = await analyzeImage(base64Image);
      console.log('Analysis complete. Ingredients found:', ingredients);

      // Save analysis result
      console.log('Saving analysis results to database...');
      const { error: dbError } = await supabase
        .from('image_analysis')
        .insert({
          user_id: session.user.id,
          ingredients,
          created_at: new Date().toISOString(),
          image_url: null // tambahkan field yang diperlukan sesuai schema
        });

      if (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { error: 'Gagal menyimpan hasil analisis' },
          { status: 500 }
        );
      }

      console.log('Analysis saved successfully');
      return NextResponse.json({ 
        success: true,
        data: {
          ingredients,
          timestamp: new Date().toISOString()
        }
      });
    } catch (analysisError) {
      console.error('Image analysis error:', analysisError);
      const errorMessage = analysisError instanceof Error 
        ? analysisError.message 
        : 'Gagal menganalisis gambar';
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? analysisError : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan yang tidak terduga' },
      { status: 500 }
    );
  }
} 