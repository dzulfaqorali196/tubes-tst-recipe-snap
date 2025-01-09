'use client';

import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface Stats {
  totalScans: number;
  totalShares: number;
}

export async function getStats(userId: string): Promise<Stats> {
  try {
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

    return {
      totalScans: totalScans || 0,
      totalShares: totalShares || 0
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalScans: 0,
      totalShares: 0
    };
  }
}

// Event untuk memperbarui statistik
export const statsEventEmitter = {
  listeners: new Set<() => void>(),

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  emit() {
    this.listeners.forEach(listener => listener());
  }
}; 