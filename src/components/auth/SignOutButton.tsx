'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClientComponentClient();
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Gagal keluar dari sistem');
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Keluar
    </button>
  );
} 