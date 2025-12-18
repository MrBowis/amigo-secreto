'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { WishlistForm } from '@/components/wishlist/WishlistForm';
import { WishlistDisplay } from '@/components/wishlist/WishlistDisplay';
import { useState, useEffect } from 'react';
import { WishlistItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { wishlistService } from '@/lib/wishlistApi';

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const wishlist = await wishlistService.getWishlist(user.uid);
      
      if (wishlist) {
        setWishlistItems(wishlist.items);
      } else {
        setWishlistItems([]);
      }
      setError('');
    } catch (err: any) {
      console.error('Error loading wishlist:', err);
      setError('Error al cargar la lista de deseos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (items: Omit<WishlistItem, 'id' | 'createdAt'>[]) => {
    if (!user) return;

    try {
      setSaving(true);
      const wishlist = await wishlistService.saveWishlist({
        user: user.uid,
        email: user.email || '',
        items: items,
      });

      setWishlistItems(wishlist.items);
      setEditing(false);
      setError('');
    } catch (err: any) {
      console.error('Error saving wishlist:', err);
      setError(err.message || 'Error al guardar la lista de deseos');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-green-700">Mi Lista de Deseos</h1>
            {wishlistItems.length > 0 && !editing && !loading && (
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="border-2 border-dashed border-green-200 rounded-lg p-12 text-center text-gray-500">
              <p className="text-lg">Cargando lista de deseos...</p>
            </div>
          ) : editing || wishlistItems.length === 0 ? (
            <>
              <WishlistForm
                onSave={handleSave}
                initialItems={wishlistItems}
              />
              {wishlistItems.length > 0 && (
                <Button
                  onClick={() => setEditing(false)}
                  variant="outline"
                  className="w-full mt-4"
                  disabled={saving}
                >
                  Cancelar
                </Button>
              )}
            </>
          ) : (
            <WishlistDisplay items={wishlistItems} ownerEmail={user?.email || ''} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
