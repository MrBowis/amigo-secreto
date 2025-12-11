'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { WishlistForm } from '@/components/wishlist/WishlistForm';
import { WishlistDisplay } from '@/components/wishlist/WishlistDisplay';
import { useState } from 'react';
import { WishlistItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [editing, setEditing] = useState(false);

  const handleSave = async (items: Omit<WishlistItem, 'id' | 'createdAt'>[]) => {
    if (!user) return;

    const newItems: WishlistItem[] = items.map((item, index) => ({
      ...item,
      id: `${Date.now()}-${index}`,
      createdAt: new Date(),
    }));

    setWishlistItems(newItems);
    setEditing(false);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-green-700">Mi Lista de Deseos</h1>
            {wishlistItems.length > 0 && !editing && (
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

          {editing || wishlistItems.length === 0 ? (
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
