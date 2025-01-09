// src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContexts';
import ImageUploader from '@/components/image/ImageUploader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [analysisKey, setAnalysisKey] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  const handleAnalysisComplete = () => {
    setAnalysisKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Selamat datang, {user?.email}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Mulai unggah foto bahan makanan Anda untuk mendapatkan rekomendasi resep.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <StatsOverview />
        </div>
      </div>

      {/* Image Uploader */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Unggah Foto
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Pilih atau ambil foto bahan makanan yang ingin Anda analisis.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <ImageUploader onAnalysisComplete={handleAnalysisComplete} />
          </div>
        </div>
      </div>
    </div>
  );
}