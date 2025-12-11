'use client';

import { WishlistItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface WishlistDisplayProps {
  items: WishlistItem[];
  ownerEmail?: string;
}

export function WishlistDisplay({ items, ownerEmail }: WishlistDisplayProps) {
  if (items.length === 0) {
    return (
      <Card className="border-green-200">
        <CardContent className="py-8 text-center text-gray-500">
          No hay productos en esta lista de deseos
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="text-green-700">Lista de Deseos</CardTitle>
        {ownerEmail && <CardDescription>De: {ownerEmail}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <a 
                    href={item.reference}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                  >
                    Ver referencia <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Deseo
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
