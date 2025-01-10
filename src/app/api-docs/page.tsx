'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ApiDocsPage = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/v1/analyze');
  const [selectedMethod, setSelectedMethod] = useState('POST');
  const [requestBody, setRequestBody] = useState('{\n  "image": "File"\n}');
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4 text-black">
      <h1 className="text-4xl font-bold mb-8">Recipe Snap API Documentation</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">About Recipe Snap API</h2>
        <p className="text-gray-700 mb-6">
          Recipe Snap API memungkinkan Anda mengintegrasikan fitur pengenalan resep dan analisis gambar makanan ke dalam aplikasi Anda.
          Kami menyediakan endpoint-endpoint yang dapat digunakan untuk menganalisis gambar makanan, mendapatkan resep, dan mengelola riwayat pengguna.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Get API Key</h2>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-xl mb-4">Login untuk Mendapatkan API Key</h3>
          <p className="text-gray-600 mb-6">
            Untuk menggunakan API ini, Anda perlu login dan mendapatkan API key. API key diperlukan untuk semua endpoint yang membutuhkan autentikasi.
          </p>
          <button 
            onClick={() => router.push('/auth')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login dengan Google
          </button>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">API Endpoints</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border p-4 text-left">Endpoint</th>
                <th className="border p-4 text-left">HTTP Method</th>
                <th className="border p-4 text-left">Description</th>
                <th className="border p-4 text-left">Required Headers</th>
                <th className="border p-4 text-left">Request Body</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border hover:bg-gray-50">
                <td className="border p-4 font-mono">/api/v1/analyze</td>
                <td className="border p-4">POST</td>
                <td className="border p-4">Menganalisis gambar makanan untuk mengidentifikasi bahan-bahan</td>
                <td className="border p-4 font-mono">x-api-key</td>
                <td className="border p-4 font-mono">
                  {`{
  "image": "File"
}`}
                </td>
              </tr>
              <tr className="border hover:bg-gray-50">
                <td className="border p-4 font-mono">/api/v1/stats</td>
                <td className="border p-4">GET</td>
                <td className="border p-4">Mendapatkan statistik penggunaan pengguna</td>
                <td className="border p-4 font-mono">x-api-key</td>
                <td className="border p-4">Query params: user_id</td>
              </tr>
              <tr className="border hover:bg-gray-50">
                <td className="border p-4 font-mono">/api/v1/history</td>
                <td className="border p-4">GET</td>
                <td className="border p-4">Mendapatkan riwayat analisis resep pengguna</td>
                <td className="border p-4 font-mono">x-api-key</td>
                <td className="border p-4">Query params: user_id, limit, offset</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Try the API</h2>
        <p className="mb-4">Pilih endpoint dan isi data yang diperlukan untuk menguji API secara langsung.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Endpoint:</label>
            <select 
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
              aria-label="Select API endpoint"
              title="Select API endpoint"
            >
              <option value="/api/v1/analyze">/api/v1/analyze</option>
              <option value="/api/v1/stats">/api/v1/stats</option>
              <option value="/api/v1/history">/api/v1/history</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">HTTP Method:</label>
            <select 
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
              aria-label="Select HTTP method"
              title="Select HTTP method"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API Key:</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-mono bg-white"
              placeholder="Masukkan API key Anda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Request Body/Params:</label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full h-32 p-2 border rounded-md font-mono bg-white"
              aria-label="Request body or parameters"
              placeholder="Enter request body (for POST) or query parameters (for GET)"
            />
          </div>

          <button 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => alert('API request will be implemented here')}
          >
            Send Request
          </button>
        </div>
      </div>

      <div className="border-t pt-8">
        <p className="text-center text-gray-600">
          © 2024 Recipe Snap. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default ApiDocsPage; 