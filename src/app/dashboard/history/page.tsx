'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import { getHistory, clearHistory } from '@/lib/services/history';
import { Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { HistoryEntry } from '@/types';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const data = await getHistory(user.id);
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
        toast.error('Gagal mengambil riwayat');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleClearHistory = async () => {
    if (!user) return;
    try {
      await clearHistory(user.id);
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Gagal menghapus riwayat');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <span className="ml-2 text-sm text-gray-600">Memuat riwayat...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Resep</h1>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700"
            title="Hapus semua riwayat"
          >
            <Trash2 className="h-4 w-4" />
            Hapus Semua
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada riwayat resep.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {history.map((entry, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              {entry.recipe.image_url && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={entry.recipe.image_url}
                    alt={entry.recipe.name}
                    className="object-cover w-full h-48"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {entry.recipe.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Bahan Terdeteksi:</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.ingredients.map((ingredient, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {ingredient.name}
                          <span className="ml-1 text-blue-600">
                            {Math.round(ingredient.confidence * 100)}%
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 