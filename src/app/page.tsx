'use client';

import { useAuth } from '@/contexts/AuthContexts';
import { Camera, ChefHat, Share2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import UserButton from '@/components/auth/UserButton';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const features = [
    {
      icon: <Camera className="h-8 w-8" />,
      title: 'Scan Bahan Makanan',
      description: 'Upload foto bahan makanan Anda, dan kami akan mengidentifikasinya secara otomatis menggunakan AI.'
    },
    {
      icon: <ChefHat className="h-8 w-8" />,
      title: 'Rekomendasi Resep',
      description: 'Dapatkan rekomendasi resep yang sesuai dengan bahan makanan yang Anda miliki.'
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: 'Bagikan Resep',
      description: 'Bagikan resep favorit Anda dengan teman dan keluarga melalui berbagai platform.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex justify-center">
              <Image
                src="/logo recipe snap.jpg"
                alt="RecipeSnap Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <span className="text-xl font-bold text-black">RecipeSnap</span>
          </Link>
          <div className="flex items-center">
            {user ? (
              <UserButton />
            ) : (
              <button
                onClick={() => router.push('/auth')}
                className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Masuk
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between py-20 gap-12">
          <div className="lg:w-1/2 space-y-8 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Ubah Foto Makanan Menjadi Resep dengan AI
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Cukup ambil foto bahan makanan Anda, dan biarkan AI kami memberikan rekomendasi resep yang sempurna.
            </p>
            {!user && (
              <div className="pt-4">
                <button
                  onClick={() => router.push('/auth')}
                  className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-full text-lg font-medium hover:bg-primary-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Mulai Sekarang
                  <ArrowRight className="ml-3 h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          <div className="lg:w-1/2 flex justify-center items-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <Image
                src="/logo recipe snap.jpg"
                alt="RecipeSnap Preview"
                width={500}
                height={500}
                className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <h2 className="text-3xl text-center font-bold text-black mb-12">Fitur Utama</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-primary-600 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">{feature.title}</h3>
                <p className="text-gray-800">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600 text-white rounded-2xl p-8 md:p-12 text-center my-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap untuk Memulai?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Bergabunglah sekarang dan temukan berbagai resep menarik untuk bahan makanan Anda.
          </p>
          {!user && (
            <button
              onClick={() => router.push('/auth')}
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-full text-lg font-medium hover:bg-gray-100 transition-transform hover:scale-105"
            >
              Daftar Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
