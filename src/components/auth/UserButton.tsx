'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import { User, LayoutDashboard, History, Heart, LogOut, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';

interface MenuItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  external?: boolean;
}

export default function UserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClientComponentClient();
      await supabase.auth.signOut();
      setIsOpen(false);
      router.push('/');
      toast.success('Berhasil keluar');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Gagal keluar dari sistem');
    }
  };

  if (!user) return null;

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: <User className="h-4 w-4" />
    },
    {
      label: 'API Docs',
      href: '/api-docs',
      icon: <BookOpen className="h-4 w-4" />,
      external: true
    },
    {
      label: 'Keluar',
      onClick: handleSignOut,
      icon: <LogOut className="h-4 w-4" />
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="User menu"
      >
        <User className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100 sm:origin-top-right sm:right-0 right-0 left-0 mx-4 sm:mx-0">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Akun</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          
          <div className="py-1">
            {menuItems.map((item, index) => (
              <div key={index} className="px-2 last:pb-2">
                {item.href ? (
                  <Link 
                    href={item.href} 
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-3 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 