// src/components/recipe/ShareRecipeDialog.tsx
import { Dialog } from '@headlessui/react';
import { useState } from 'react';

interface ShareRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (email: string) => Promise<void>;
}

export default function ShareRecipeDialog({ 
  isOpen, 
  onClose, 
  onShare 
}: ShareRecipeDialogProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onShare(email);
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900">
            Bagikan Resep
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="mt-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Penerima
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                required
              />
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Memproses...' : 'Bagikan'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}