'use client';

import { useAuth } from '@/contexts/AuthContexts';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Key, Camera, Share2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Navbar from '@/components/layout/Navbar';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  totalScans: number;
  totalShares: number;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalScans: 0,
    totalShares: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

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

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Saya</h1>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nama Pengguna</p>
                  <p className="text-lg text-gray-900">{user.email?.split('@')[0]}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <Key className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Password</p>
                  <button className="text-primary-600 hover:text-primary-700 font-medium">
                    Ubah Password
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistik</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Total Scan</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalScans}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Resep Dibagikan</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalShares}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 