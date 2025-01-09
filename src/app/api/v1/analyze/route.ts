/**
 * @swagger
 * /api/v1/analyze:
 *   post:
 *     summary: Analisis gambar bahan makanan
 *     description: Menganalisis gambar bahan makanan dan mengembalikan daftar bahan yang terdeteksi
 *     tags:
 *       - Analisis
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File gambar yang akan dianalisis
 *     responses:
 *       200:
 *         description: Berhasil menganalisis gambar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     ingredients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "tomat"
 *                           confidence:
 *                             type: number
 *                             example: 0.95
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Gambar tidak ditemukan
 *       401:
 *         description: API key tidak valid
 *       500:
 *         description: Error server
 */

import { NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/vision';

export async function POST(request: Request) {
  try {
    // Validasi API key
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert image to base64
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString('base64');

    // Analyze image
    const ingredients = await analyzeImage(base64Image);

    return NextResponse.json({ 
      success: true,
      data: {
        ingredients: ingredients,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze image' },
      { status: 500 }
    );
  }
} 