// src/components/dashboard/StatsOverview.tsx
'use client';

import { useEffect, useState } from 'react';
import { Camera, Share2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContexts';

interface Stats {
  totalScans: number;
  totalShares: number;
}

export default function StatsOverview() {
  const [stats, setStats] = useState<Stats>({
    totalScans: 0,
    totalShares: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        const [scansResult, sharedResult] = await Promise.all([
          supabase
            .from('image_analysis')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id),
          supabase
            .from('shared_recipes')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
        ]);

        setStats({
          totalScans: scansResult.count || 0,
          totalShares: sharedResult.count || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Camera className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Scan</p>
            <p className="text-2xl font-semibold text-gray-900">
              {isLoading ? '...' : stats.totalScans}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Share2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Resep Dibagikan</p>
            <p className="text-2xl font-semibold text-gray-900">
              {isLoading ? '...' : stats.totalShares}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}