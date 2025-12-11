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
  const getAssignedParticipant = (giverId: string) => {
    const assignment = secretSanta.assignments.find(a => a.giverId === giverId);
    if (!assignment) return undefined;
    return secretSanta.participants.find(p => p.id === assignment.receiverId);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {secretSanta.participants.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                assignedTo={getAssignedParticipant(participant.id)}
                showAssignment={secretSanta.isDrawn}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
