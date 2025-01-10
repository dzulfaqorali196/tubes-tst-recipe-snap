'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ApiDocsPage = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/recipes/generate');
  const [selectedMethod, setSelectedMethod] = useState('POST');
  const [requestBody, setRequestBody] = useState('');
  const [responseData, setResponseData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [domain, setDomain] = useState('');
  const [apiKey, setApiKey] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const generateApiKey = async () => {
    if (!domain) {
      alert('Mohon masukkan domain aplikasi Anda');
      return;
    }
    const generatedKey = `rs_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
    setApiKey(generatedKey);
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      // Gunakan sandbox endpoint untuk testing
      const sandboxUrl = '/api/sandbox';
      
      const requestData = {
        endpoint: selectedEndpoint,
        method: selectedMethod,
        data: selectedMethod === 'POST' ? JSON.parse(requestBody) : requestBody
      };

      const response = await fetch(sandboxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      
      // Format response untuk ditampilkan
      const formattedResponse = {
        status: response.status,
        statusText: response.statusText,
        data: data
      };

      setResponseData(JSON.stringify(formattedResponse, null, 2));
    } catch (error) {
      console.error('Request error:', error);
      setResponseData(JSON.stringify({
        error: 'Failed to fetch response',
        details: error instanceof Error ? error.message : String(error)
      }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const endpoints = [
    {
      value: '/api/recipes/generate',
      label: '/api/recipes/generate',
      method: 'POST',
      example: `{
  "ingredients": ["bawang", "tomat", "cabai"]
}`
    },
    {
      value: '/api/recipes',
      label: '/api/recipes',
      method: 'GET',
      example: 'page=1&limit=10'
    },
    {
      value: '/api/recipes/analyze',
      label: '/api/recipes/analyze',
      method: 'POST',
      example: `{
  "ingredients": ["bawang", "tomat", "cabai"],
  "preferences": {
    "cuisine": "Indonesian",
    "dietary": "Regular"
  }
}`
    },
    {
      value: '/api/recipes/history',
      label: '/api/recipes/history',
      method: 'GET',
      example: 'page=1&limit=10'
    }
  ];

  const getRequestBodyExample = (endpoint: string) => {
    const selectedEndpoint = endpoints.find(e => e.value === endpoint);
    return selectedEndpoint?.example || '';
  };

  useEffect(() => {
    const endpoint = endpoints.find(e => e.value === selectedEndpoint);
    if (endpoint) {
      setSelectedMethod(endpoint.method);
      setRequestBody(endpoint.example);
    }
    setResponseData('');
  }, [selectedEndpoint]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 text-black">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-12">
          <h1 className="text-4xl font-bold mb-4">Recipe Snap API Documentation</h1>
          <p className="text-lg opacity-90">
            Integrasikan fitur pengenalan resep dan analisis gambar makanan ke dalam aplikasi Anda
          </p>
        </div>
        
        {/* About Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">About Recipe Snap API</h2>
          <p className="text-gray-700">
            Recipe Snap API memungkinkan Anda mengintegrasikan fitur pengenalan resep dan analisis gambar makanan ke dalam aplikasi Anda.
            Kami menyediakan endpoint-endpoint yang dapat digunakan untuk menganalisis gambar makanan, mendapatkan resep, dan mengelola riwayat pengguna.
          </p>
        </div>

        {/* Get API Key Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Get API Key</h2>
          <div className="bg-gray-50 p-6 rounded-lg border">
            {isAuthenticated ? (
              <>
                <h3 className="text-xl mb-4">Generate API Key</h3>
                <p className="text-gray-600 mb-4">
                  Masukkan domain aplikasi Anda untuk mendapatkan API key. API key diperlukan jika Anda ingin mengintegrasikan API ke aplikasi Anda.
                </p>
                <div className="mb-4">
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="https://yourdomain.com"
                    className="w-full p-2 border rounded-md mb-4"
                  />
                  <button 
                    onClick={generateApiKey}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Generate API Key
                  </button>
                </div>
                {apiKey && (
                  <div className="mt-4 p-4 bg-white rounded-md border">
                    <p className="font-semibold mb-2">Your API Key:</p>
                    <code className="block p-2 bg-gray-50 rounded">{apiKey}</code>
                    <p className="text-sm text-gray-500 mt-2">
                      Simpan API key ini dengan aman. API key tidak akan ditampilkan lagi.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="text-xl mb-4">Login untuk Mendapatkan API Key</h3>
                <p className="text-gray-600 mb-6">
                  Untuk mengintegrasikan API ke aplikasi Anda, Anda perlu login dan mendapatkan API key.
                </p>
                <button 
                  onClick={() => router.push('/auth')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login dengan Google
                </button>
              </>
            )}
          </div>
        </div>

        {/* API Endpoints Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">API Endpoints</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border p-4 text-left">Endpoint</th>
                  <th className="border p-4 text-left">HTTP Method</th>
                  <th className="border p-4 text-left">Description</th>
                  <th className="border p-4 text-left">Required Request Body</th>
                  <th className="border p-4 text-left">Guide</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border hover:bg-gray-50">
                  <td className="border p-4 font-mono">/api/recipes/generate</td>
                  <td className="border p-4">POST</td>
                  <td className="border p-4">Generate resep dari gambar makanan</td>
                  <td className="border p-4">
                    <pre className="whitespace-pre-wrap text-sm">
                      {`{
  "ingredients": ["bawang", "tomat", "cabai"]
}`}
                    </pre>
                  </td>
                  <td className="border p-4">Upload gambar makanan untuk mendapatkan resep</td>
                </tr>
                <tr className="border hover:bg-gray-50">
                  <td className="border p-4 font-mono">/api/recipes</td>
                  <td className="border p-4">GET</td>
                  <td className="border p-4">Mendapatkan daftar resep</td>
                  <td className="border p-4">
                    <pre className="whitespace-pre-wrap text-sm">
                      Query params (optional):
                      - page: number
                      - limit: number
                    </pre>
                  </td>
                  <td className="border p-4">Mengambil daftar resep dengan pagination</td>
                </tr>
                <tr className="border hover:bg-gray-50">
                  <td className="border p-4 font-mono">/api/recipes/analyze</td>
                  <td className="border p-4">POST</td>
                  <td className="border p-4">Analisis bahan makanan</td>
                  <td className="border p-4">
                    <pre className="whitespace-pre-wrap text-sm">
                      {`{
  "ingredients": string[],
  "preferences": {
    "cuisine": string,
    "dietary": string
  }
}`}
                    </pre>
                  </td>
                  <td className="border p-4">Analisis bahan untuk mendapatkan rekomendasi resep</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Try API Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Try the API</h2>
          <p className="mb-6 text-gray-700">
            Pilih endpoint dan isi data yang diperlukan untuk menguji API secara langsung.
            Untuk uji coba tidak memerlukan API key.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Request Panel */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Request</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Endpoint:</label>
                <select 
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white"
                  aria-label="Select API endpoint"
                >
                  {endpoints.map(endpoint => (
                    <option key={endpoint.value} value={endpoint.value}>
                      {endpoint.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">HTTP Method:</label>
                <select 
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white"
                  aria-label="Select HTTP method"
                  disabled
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {selectedMethod === 'GET' ? 'Query Parameters:' : 'Request Body (JSON):'}
                </label>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full h-48 p-2 border rounded-md font-mono bg-white"
                  placeholder={selectedMethod === 'GET' ? 'Enter query parameters' : 'Enter JSON request body'}
                />
              </div>

              <button 
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={handleSendRequest}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>

            {/* Response Panel */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Response</h3>
              <div className="border rounded-md bg-gray-50 p-4 h-[400px] overflow-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {responseData || 'Response will appear here...'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-8">
          <p className="text-center text-gray-600">
            © 2024 Recipe Snap. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsPage; 