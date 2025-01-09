'use client';

import { createClient } from '@/lib/supabase/client';
import { Recipe } from '@/types';
import { statsEventEmitter } from './stats';
import toast from 'react-hot-toast';

const supabase = createClient();

export async function shareRecipe(recipe: Recipe, sharedWith: string, userId: string) {
  try {
    // Cek apakah resep sudah dibagikan ke pengguna tersebut
    const { data: existingShare } = await supabase
      .from('shared_recipes')
      .select('id')
      .eq('user_id', userId)
      .eq('shared_with', sharedWith)
      .eq('recipe_data->name', recipe.name)
      .single();

    if (existingShare) {
      toast.error('Resep sudah dibagikan ke pengguna ini');
      return;
    }

    const { error } = await supabase
      .from('shared_recipes')
      .insert({
        user_id: userId,
        shared_with: sharedWith,
        recipe_data: recipe,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    toast.success('Berhasil membagikan resep');
  } catch (error) {
    console.error('Error sharing recipe:', error);
    toast.error('Gagal membagikan resep');
    throw error;
  }
}

export async function getSharedRecipes(userId: string): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from('shared_recipes')
      .select('recipe_data')
      .eq('shared_with', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(item => item.recipe_data as Recipe) || [];
  } catch (error) {
    console.error('Error fetching shared recipes:', error);
    return [];
  }
}

export async function removeSharedRecipe(recipeName: string, sharedWith: string, userId: string) {
  try {
    const { error } = await supabase
      .from('shared_recipes')
      .delete()
      .eq('user_id', userId)
      .eq('shared_with', sharedWith)
      .eq('recipe_data->name', recipeName);

    if (error) throw error;
    toast.success('Berhasil menghapus resep yang dibagikan');
  } catch (error) {
    console.error('Error removing shared recipe:', error);
    toast.error('Gagal menghapus resep yang dibagikan');
    throw error;
  }
}

export async function saveShareHistory(
  recipe: Recipe,
  userId: string,
  platform: string
) {
  try {
    if (!recipe || !userId || !platform) {
      throw new Error('Data tidak lengkap untuk menyimpan riwayat berbagi');
    }

    const shareEntry = {
      user_id: userId,
      recipe_data: recipe,
      platform,
      shared_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('share_history')
      .insert(shareEntry);

    if (error) {
      console.error('Database error:', error);
      throw new Error('Gagal menyimpan riwayat berbagi');
    }

    if (typeof window !== 'undefined') {
      statsEventEmitter.emit();
    }

    toast.success('Berhasil membagikan resep');
    return true;
  } catch (error) {
    console.error('Error saving share history:', error);
    toast.error(error instanceof Error ? error.message : 'Gagal menyimpan riwayat berbagi');
    throw error;
  }
} 