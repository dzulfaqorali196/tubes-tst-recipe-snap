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

    // Upload image to storage first
    console.log('Uploading image to storage...');
    const fileName = `${Date.now()}-${image.name}`;
    const filePath = `public/${fileName}`;
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('food-images')
      .upload(filePath, image, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Gagal mengunggah gambar' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('food-images')
      .getPublicUrl(filePath);

    console.log('Image uploaded successfully. Public URL:', publicUrl);

    // Analyze image
    try {
      console.log('Starting image analysis...');
      const tags = await analyzeImage(base64Image);
      console.log('Analysis complete. Tags found:', tags);

      // Transform tags into ingredients format
      const ingredients = tags.map(tag => ({
        name: tag,
        confidence: 1.0
      }));

      // Save analysis result
      console.log('Saving analysis results to database...');
      const { error: dbError } = await supabase
        .from('image_analysis')
        .insert({
          user_id: session.user.id,
          image_path: filePath,
          image_url: publicUrl,
          ingredients: ingredients,
          created_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Delete uploaded image if database insert fails
        await supabase.storage
          .from('food-images')
          .remove([filePath]);
          
        return NextResponse.json(
          { error: 'Gagal menyimpan hasil analisis' },
          { status: 500 }
        );
      }

      console.log('Analysis saved successfully');
      return NextResponse.json({ 
        success: true,
        data: {
          ingredients: ingredients,
          image_url: publicUrl,
          timestamp: new Date().toISOString()
        }
      });
    } catch (analysisError) {
      console.error('Image analysis error:', analysisError);
      // Delete uploaded image if analysis fails
      await supabase.storage
        .from('food-images')
        .remove([filePath]);
        
      const errorMessage = analysisError instanceof Error 
        ? analysisError.message 
        : 'Gagal menganalisis gambar';
      
      const errorDetails = {
        message: errorMessage,
        type: analysisError instanceof Error ? analysisError.name : typeof analysisError,
        stack: analysisError instanceof Error ? analysisError.stack : undefined
      };

      console.error('Error details:', errorDetails);
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
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