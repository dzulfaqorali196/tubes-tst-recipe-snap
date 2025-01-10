import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ user }: { user: any }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirect ke halaman utama setelah sign out
    router.refresh();
  };

  const apiDocs = [
    { name: 'Recipe API', url: 'https://smart-health-tst.up.railway.app/docs' },
    { name: 'Vision API', url: 'https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                RecipeSnap
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md">
                Home
              </Link>
              
              {/* API Documentation Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md inline-flex items-center"
                >
                  <span>API Docs</span>
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isOpen && (
                  <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {apiDocs.map((doc) => (
                        <a
                          key={doc.name}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {doc.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {user && (
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/" className="text-gray-600 hover:text-gray-800 block px-3 py-2 rounded-md">
            Home
          </Link>
          
          {/* Mobile API Docs */}
          <div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-800 block px-3 py-2 rounded-md w-full text-left"
            >
              API Docs
            </button>
            {isOpen && (
              <div className="pl-4">
                {apiDocs.map((doc) => (
                  <a
                    key={doc.name}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    {doc.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {user && (
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800 block px-3 py-2 rounded-md">
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 