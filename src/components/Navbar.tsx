'use client';

import { useState } from 'react';
import { User } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, History, BookOpen, User as UserIcon, LogOut } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClientComponentClient();
      await supabase.auth.signOut();
      router.push('/');
      toast.success('Berhasil keluar');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Gagal keluar dari sistem');
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo dan Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo.png"
                  alt="RecipeSnap"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">RecipeSnap</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center mb-3">
              <Image
                src="/logo.png"
                alt="RecipeSnap"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="ml-3 text-base font-medium text-gray-800">
                RecipeSnap
              </span>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-500">Akun</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <div className="px-2 py-3 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/riwayat"
              className="flex items-center gap-3 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <History className="h-5 w-5" />
              Riwayat
            </Link>
            <Link
              href="/api-docs"
              className="flex items-center gap-3 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              API Docs
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="h-5 w-5" />
              Profile
            </Link>
            <button
              onClick={() => {
                handleSignOut();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <LogOut className="h-5 w-5" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 