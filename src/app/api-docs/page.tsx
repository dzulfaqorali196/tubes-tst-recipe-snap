'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'swagger-ui-react/swagger-ui.css';

// Definisikan tipe untuk SwaggerUI props
interface SwaggerUIProps {
  spec: any;
  docExpansion?: 'list' | 'full' | 'none';
  defaultModelsExpandDepth?: number;
}

// Import SwaggerUI secara dinamis untuk menghindari SSR
const SwaggerUI = dynamic<SwaggerUIProps>(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  )
});

export default function ApiDocs() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    // Memuat spesifikasi Swagger
    fetch('/api/docs/swagger.json')
      .then(res => res.json())
      .then(data => setSpec(data))
      .catch(err => console.error('Error loading swagger spec:', err));
  }, []);

  if (!spec) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-primary-500">
          <h1 className="text-2xl font-bold text-white">
            RecipeSnap API Documentation
          </h1>
        </div>
        <div className="p-6">
          <SwaggerUI
            spec={spec}
            docExpansion="list"
            defaultModelsExpandDepth={-1}
          />
        </div>
      </div>
    </div>
  );
} 