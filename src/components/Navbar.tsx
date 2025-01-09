'use client';

import { User } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import SignOutButton from '@/components/auth/SignOutButton';

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-gray-800">
              RecipeSnap
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  );
} 