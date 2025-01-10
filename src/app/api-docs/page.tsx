'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ApiDocsPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Recipe Snap API Documentation</h1>
      
      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="recipes">Recipes API</TabsTrigger>
          <TabsTrigger value="user">User API</TabsTrigger>
          <TabsTrigger value="auth">Auth API</TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">GET /api/recipes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Mendapatkan daftar resep</p>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Parameters:</h3>
                  <ul className="list-disc pl-6">
                    <li>page (optional): Nomor halaman</li>
                    <li>limit (optional): Jumlah item per halaman</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Response:</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg">
{`{
  "data": [
    {
      "id": "string",
      "title": "string",
      "ingredients": "string[]",
      "instructions": "string",
      "image_url": "string"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">POST /api/recipes/generate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Generate resep dari gambar</p>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Request Body:</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg">
{`{
  "image": "File",
  "prompt": "string (optional)"
}`}
                  </pre>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Response:</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg">
{`{
  "recipe": {
    "title": "string",
    "ingredients": "string[]",
    "instructions": "string",
    "image_url": "string"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="user">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">GET /api/user/profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Mendapatkan profil pengguna</p>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Headers:</h3>
                  <ul className="list-disc pl-6">
                    <li>Authorization: Bearer {`{token}`}</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Response:</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg">
{`{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "avatar_url": "string"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="auth">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">POST /api/auth/login</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Login pengguna</p>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Request Body:</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg">
{`{
  "email": "string",
  "password": "string"
}`}
                  </pre>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Response:</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg">
{`{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiDocsPage; 