'use client';

import { createClient } from '@/lib/supabase/client';
import { Recipe, HistoryEntry } from '@/types';
import toast from 'react-hot-toast';

const supabase = createClient();

export async function addToHistory(
  recipe: Recipe,
  ingredients: { name: string; confidence: number }[],
  userId: string
) {
  try {
    if (!recipe || !ingredients || !userId) {
      throw new Error('Data tidak lengkap untuk menambahkan ke riwayat');
    }

    const historyEntry = {
      user_id: userId,
      recipe_data: recipe,
      ingredients: ingredients,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('recipe_history')
      .insert(historyEntry);

    if (error) {
      console.error('Database error:', error);
      throw new Error('Gagal menyimpan ke riwayat');
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('refreshStats'));
    }

    toast.success('Berhasil menambahkan ke riwayat');
    return true;
  } catch (error) {
    console.error('Error adding to history:', error);
    toast.error(error instanceof Error ? error.message : 'Gagal menambahkan ke riwayat');
    throw error;
  }
}

export async function getHistory(userId: string): Promise<HistoryEntry[]> {
  try {
    if (!userId) {
      throw new Error('User ID diperlukan');
    }

    const { data, error } = await supabase
      .from('recipe_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    return data.map(item => ({
      recipe: item.recipe_data as Recipe,
      ingredients: item.ingredients as { name: string; confidence: number }[],
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching history:', error);
    toast.error('Gagal mengambil riwayat');
    return [];
  }
}

export async function clearHistory(userId: string) {
  try {
    if (!userId) {
      throw new Error('User ID diperlukan');
    }

    const { error } = await supabase
      .from('recipe_history')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('refreshStats'));
    }

    toast.success('Berhasil menghapus riwayat');
  } catch (error) {
    console.error('Error clearing history:', error);
    toast.error('Gagal menghapus riwayat');
    throw error;
  }
} 