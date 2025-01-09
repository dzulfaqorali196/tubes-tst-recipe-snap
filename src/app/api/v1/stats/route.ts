/**
 * @swagger
 * /api/v1/stats:
 *   get:
 *     summary: Mendapatkan statistik pengguna
 *     description: Mengambil statistik penggunaan aplikasi oleh pengguna
 *     tags:
 *       - Statistik
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Berhasil mengambil statistik
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
 *                     totalScans:
 *                       type: integer
 *                       example: 50
 *                     totalShares:
 *                       type: integer
 *                       example: 20
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
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

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    // Get total scans
    const { count: totalScans } = await supabase
      .from('image_analysis')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get total shares
    const { count: totalShares } = await supabase
      .from('shared_recipes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      data: {
        totalScans: totalScans || 0,
        totalShares: totalShares || 0,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 