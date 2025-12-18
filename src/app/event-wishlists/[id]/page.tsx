'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { participantService, EventParticipantWithWishlist } from '@/lib/participantApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, ExternalLink, User, Package } from 'lucide-react';

export default function EventWishlistsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.id as string;
  const email = searchParams.get('email') || '';
  
  const [participants, setParticipants] = useState<EventParticipantWithWishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventId && email) {
      loadParticipants();
    } else {
      setError('Información incompleta');
      setLoading(false);
    }
  }, [eventId, email]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const data = await participantService.getEventParticipantsWithWishlists(
        parseInt(eventId),
        email
      );
      setParticipants(data);
      setError('');
    } catch (err: any) {
      console.error('Error loading participants:', err);
      setError(err.message || 'Error al cargar las listas de deseos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando listas de deseos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-green-50 to-white flex items-center justify-center">
        <Card className="max-w-md border-red-200">
          <CardContent className="py-12 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <a href="/my-draws" className="text-green-600 hover:underline">
              Volver a mis sorteos
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <a
              href={`/my-draws?email=${encodeURIComponent(email)}`}
              className="text-green-600 hover:underline mb-4 inline-block"
            >
              ← Volver a mis sorteos
            </a>
            <h1 className="text-4xl font-bold text-green-700 mb-4">
              Listas de Deseos de Participantes
            </h1>
            <p className="text-gray-600">
              Aquí puedes ver las listas de deseos de todos los participantes del sorteo
            </p>
          </div>

          {participants.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="py-12 text-center text-gray-500">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No hay participantes en este sorteo</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {participants.map((participant) => (
                <Card
                  key={participant.id}
                  className="border-green-200 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-green-700">
                          {participant.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {participant.email}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {participant.wishlist && participant.wishlist.items.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <Gift className="h-5 w-5 text-green-600" />
                          <p className="font-semibold text-gray-900">
                            Lista de Deseos ({participant.wishlist.items.length})
                          </p>
                        </div>
                        {participant.wishlist.items.map((item, index) => (
                          <div
                            key={item.id}
                            className="p-4 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    #{index + 1}
                                  </Badge>
                                  <p className="font-medium text-gray-900">
                                    {item.title}
                                  </p>
                                </div>
                                {item.reference && (
                                  <a
                                    href={item.reference}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-green-600 hover:underline flex items-center gap-1 mt-2"
                                  >
                                    Ver referencia
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 bg-gray-50 rounded-lg text-center">
                        <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 text-sm">
                          Este participante aún no ha creado su lista de deseos
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
