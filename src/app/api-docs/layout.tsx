import React from 'react';

export const metadata = {
  title: 'API Documentation - Recipe Snap',
  description: 'Dokumentasi API untuk Recipe Snap',
};

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 