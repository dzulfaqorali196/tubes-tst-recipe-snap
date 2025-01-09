// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContexts';
import { ImageProvider } from '@/contexts/ImageContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RecipeSnap',
  description: 'Ubah foto bahan makanan menjadi resep dalam sekejap dengan AI',
  icons: {
    icon: '/logo recipe snap.jpg',
    shortcut: '/logo recipe snap.jpg',
    apple: '/logo recipe snap.jpg',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo recipe snap.jpg" />
        <link rel="shortcut icon" href="/logo recipe snap.jpg" />
        <link rel="apple-touch-icon" href="/logo recipe snap.jpg" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ImageProvider>
            <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
              {children}
            </main>
            <Toaster />
          </ImageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}