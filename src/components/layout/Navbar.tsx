// src/components/layout/Navbar.tsx
'use client';

import { useAuth } from '@/contexts/AuthContexts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Recipe<span className="text-primary-600">Snap</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <User className="h-5 w-5" />
                    <span>{user.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profil Saya
                      </Link>
                      <button
                        onClick={async () => {
                          await signOut();
                          router.push('/');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="h-4 w-4" />
                          <span>Keluar</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => router.push('/auth')}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}