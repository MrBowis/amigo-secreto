'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { WishlistItem } from '@/types';

interface WishlistFormProps {
  onSave: (items: Omit<WishlistItem, 'id' | 'createdAt'>[]) => Promise<void>;
  initialItems?: WishlistItem[];
}

export function WishlistForm({ onSave, initialItems = [] }: WishlistFormProps) {
  const [items, setItems] = useState<{ title: string; reference: string }[]>(
    initialItems.length > 0 
      ? initialItems.map(item => ({ title: item.title, reference: item.reference }))
      : [{ title: '', reference: '' }]
  );
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { title: '', reference: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: 'title' | 'reference', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validItems = items.filter(item => item.title.trim() && item.reference.trim());
    
    try {
      await onSave(validItems);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="text-green-700">Mi Lista de Deseos</CardTitle>
        <CardDescription>Agrega los productos que deseas recibir</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`title-${index}`}>Producto</Label>
                <Input
                  id={`title-${index}`}
                  placeholder="Ej: Libro de cocina"
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor={`reference-${index}`}>Referencia / Enlace</Label>
                <Input
                  id={`reference-${index}`}
                  placeholder="https://..."
                  value={item.reference}
                  onChange={(e) => updateItem(index, 'reference', e.target.value)}
                  required
                />
              </div>
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeItem(index)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="w-full border-green-200 text-green-600 hover:bg-green-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Button>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Lista'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
