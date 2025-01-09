// src/app/dashboard/layout.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, LayoutDashboard, History, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import UserButton from '@/components/auth/UserButton';

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/';
        return;
      }
      setSession(session);
    };

    checkSession();
  }, []);

  if (!session) {
    return null;
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: 'Riwayat',
      href: '/dashboard/history',
      icon: <History className="h-5 w-5" />
    },
    {
      name: 'API Docs',
      href: '/api-docs',
      icon: <BookOpen className="h-5 w-5" />,
      external: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
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
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-center space-x-2 border-transparent text-gray-500 hover:border-primary-500 hover:text-gray-700 px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="hidden sm:flex items-center space-x-4">
                  <UserButton />
                </div>
                <div className="sm:hidden">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                    title={isMenuOpen ? "Tutup menu" : "Buka menu"}
                    aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                  >
                    {isMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="px-3 py-2 border-t border-gray-200">
                <UserButton />
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {children}
      </main>
    </div>
  );
}