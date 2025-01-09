// src/app/dashboard/profile/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import toast from 'react-hot-toast';

interface ProfileData {
  name: string;
  allergies: string[];
  dietaryPreferences: string;
}

const allergyOptions = [
  'Kacang',
  'Susu',
  'Telur',
  'Seafood',
  'Gluten'
];

const dietOptions = [
  'Normal',
  'Vegetarian',
  'Vegan',
  'Bebas Gluten',
  'Rendah Karbo'
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    allergies: [],
    dietaryPreferences: 'Normal'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setProfile(prev => ({
      ...prev,
      allergies: values
    }));
  };

  const handleDietChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfile(prev => ({
      ...prev,
      dietaryPreferences: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement profile update logic
      toast.success('Profil berhasil diperbarui');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Gagal memperbarui profil');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profil Pengguna</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Masukkan nama Anda"
                aria-label="Nama"
              />
            </div>
            
            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                Alergi
              </label>
              <select
                id="allergies"
                multiple
                name="allergies"
                value={profile.allergies}
                onChange={handleAllergyChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                aria-label="Pilih alergi"
              >
                {allergyOptions.map(allergy => (
                  <option key={allergy} value={allergy}>{allergy}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-gray-700">
                Preferensi Diet
              </label>
              <select
                id="dietaryPreferences"
                name="dietaryPreferences"
                value={profile.dietaryPreferences}
                onChange={handleDietChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                aria-label="Pilih preferensi diet"
              >
                {dietOptions.map(diet => (
                  <option key={diet} value={diet}>{diet}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}