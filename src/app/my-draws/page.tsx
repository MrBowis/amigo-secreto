'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { participantService, ParticipantEvent } from '@/lib/participantApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Gift, Mail, User, Calendar } from 'lucide-react';
import Link from 'next/link';

function MyDrawsContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [events, setEvents] = useState<ParticipantEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (searchParams.get('email')) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const myEvents = await participantService.getMyEvents(email);
      setEvents(myEvents);
      setSearched(true);
    } catch (err: any) {
      console.error('Error loading events:', err);
      setError('Error al cargar tus sorteos');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-red-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-red-700 mb-4">Mis Sorteos de Amigo Secreto</h1>
            <p className="text-gray-600">
              Ingresa tu email para ver los sorteos en los que has sido incluido
            </p>
          </div>

          {/* Search Box */}
          <Card className="mb-8 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Buscar por Email</CardTitle>
              <CardDescription>
                Usa el email con el que fuiste agregado al sorteo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {searched && (
            <div>
              {events.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="py-12 text-center text-gray-500">
                    <Gift className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No se encontraron sorteos para este email</p>
                    <p className="text-sm mt-2">
                      Verifica que el email sea correcto o espera a que te agreguen a un sorteo
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tus Sorteos ({events.length})
                  </h2>
                  {events.map((event) => (
                    <Card key={event.id} className="border-green-200 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-green-700 mb-2">
                              {event.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(event.created_at).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                            <User className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-600">Participas como:</p>
                              <p className="font-semibold text-gray-900">{event.participant.name}</p>
                            </div>
                          </div>

                          {event.assignment ? (
                            <div className="p-6 bg-linear-to-r from-red-50 to-pink-50 rounded-lg border-2 border-red-200">
                              <div className="flex items-center gap-3 mb-3">
                                <Gift className="h-8 w-8 text-red-600" />
                                <div>
                                  <p className="text-sm text-gray-600">Tu amigo secreto es:</p>
                                  <p className="text-2xl font-bold text-red-700">
                                    {event.assignment.receiver_name}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 pt-4 border-t border-red-200">
                                <Link
                                  href={`/event-wishlists/${event.id}?email=${encodeURIComponent(email)}`}
                                >
                                  <Button
                                    variant="outline"
                                    className="w-full border-green-500 text-green-700 hover:bg-green-50"
                                  >
                                    Ver Lista de Deseos de {event.assignment.receiver_name}
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                              <p>El sorteo aún no ha sido realizado</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyDrawsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-b from-red-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-700 mb-4">Cargando...</h1>
            </div>
          </div>
        </div>
      </div>
    }>
      <MyDrawsContent />
    </Suspense>
  );
}
