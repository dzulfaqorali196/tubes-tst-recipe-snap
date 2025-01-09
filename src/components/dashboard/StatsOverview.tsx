'use client';

import { useEffect, useState } from 'react';
import { Camera, Share2 } from 'lucide-react';
import { getStats, statsEventEmitter } from '@/lib/services/stats';
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
  const { user } = useAuth();

  const loadStats = async () => {
    if (!user) return;
    const data = await getStats(user.id);
    setStats(data);
  };

  useEffect(() => {
    loadStats();
    
    // Subscribe ke perubahan statistik
    const unsubscribe = statsEventEmitter.subscribe(() => {
      loadStats();
    });

    return () => {
      unsubscribe();
    };
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
            <p className="text-2xl font-semibold text-gray-900">{stats.totalScans}</p>
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
            <p className="text-2xl font-semibold text-gray-900">{stats.totalShares}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 