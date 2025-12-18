'use client';

import { SecretSanta } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ParticipantCard } from './ParticipantCard';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';

interface SecretSantaDisplayProps {
  secretSanta: SecretSanta;
  onPerformDraw?: () => Promise<void>;
  loading?: boolean;
}

export function SecretSantaDisplay({ secretSanta, onPerformDraw, loading = false }: SecretSantaDisplayProps) {
  return (
    <Card className="border-red-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-red-700">{secretSanta.name}</CardTitle>
            <CardDescription>
              {secretSanta.participants.length} participantes
            </CardDescription>
          </div>
          {!secretSanta.isDrawn && onPerformDraw && (
            <Button
              onClick={onPerformDraw}
              disabled={loading || secretSanta.participants.length < 2}
              className="bg-red-600 hover:bg-red-700"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              {loading ? 'Sorteando...' : 'Realizar Sorteo'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!secretSanta.isDrawn ? (
          <div className="text-center py-8 text-gray-500">
            <p>El sorteo aún no se ha realizado</p>
            <p className="text-sm mt-2">Haz clic en "Realizar Sorteo" para asignar amigos secretos</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200 text-center">
              <p className="text-lg font-semibold text-green-700 mb-2">
                ¡Sorteo completado! 🎉
              </p>
              <p className="text-sm text-gray-600">
                Los participantes recibieron un email con su asignación secreta
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {secretSanta.participants.map((participant) => (
                <Card key={participant.id} className="border-gray-200">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                        <span className="text-red-600 font-bold text-xl">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900">{participant.name}</p>
                      <p className="text-sm text-gray-500">{participant.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
