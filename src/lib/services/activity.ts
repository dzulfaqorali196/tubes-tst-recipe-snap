'use client';

import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

interface ActivityStats {
  totalScans: number;
  totalFavorites: number;
  totalShared: number;
}

export async function getActivityStats(userId: string): Promise<ActivityStats> {
  try {
    const [scansResult, favoritesResult, sharedResult] = await Promise.all([
      // Get total scans
      supabase
        .from('image_analysis')
        .select('*', { count: 'exact' })
        .eq('user_id', userId),

      // Get total favorites
      supabase
        .from('favorite_recipes')
        .select('*', { count: 'exact' })
        .eq('user_id', userId),

      // Get total shared
      supabase
        .from('shared_recipes')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
    ]);

    return {
      totalScans: scansResult.count || 0,
      totalFavorites: favoritesResult.count || 0,
      totalShared: sharedResult.count || 0
    };
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return {
      totalScans: 0,
      totalFavorites: 0,
      totalShared: 0
    };
  }
}

export async function getRecentActivity(userId: string, limit: number = 5) {
  try {
    const [scans, favorites, shared] = await Promise.all([
      // Get recent scans
      supabase
        .from('image_analysis')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit),

      // Get recent favorites
      supabase
        .from('favorite_recipes')
        .select('*, recipes(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit),

      // Get recent shared
      supabase
        .from('shared_recipes')
        .select('*, recipes(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
    ]);

    return {
      recentScans: scans.data || [],
      recentFavorites: favorites.data || [],
      recentShared: shared.data || []
    };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return {
      recentScans: [],
      recentFavorites: [],
      recentShared: []
    };
  }
}