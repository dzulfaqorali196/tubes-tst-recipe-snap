/**
 * @swagger
 * /api/v1/history:
 *   get:
 *     summary: Mendapatkan riwayat analisis
 *     description: Mengambil riwayat analisis gambar bahan makanan dengan pagination
 *     tags:
 *       - Riwayat
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID pengguna
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset data
 *     responses:
 *       200:
 *         description: Berhasil mengambil riwayat
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
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           user_id:
 *                             type: string
 *                           recipe_data:
 *                             type: object
 *                           ingredients:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                 confidence:
 *                                   type: number
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     offset:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Parameter tidak valid
 *       401:
 *         description: API key tidak valid
 *       500:
 *         description: Error server
 */

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // Validasi API key
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      );
    }

    // Get user_id from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const { data, error, count } = await supabase
      .from('recipe_history')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: {
        history: data,
        total: count,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch history' },
      { status: 500 }
    );
  }
} 