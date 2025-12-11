'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { SecretSantaForm } from '@/components/secret-santa/SecretSantaForm';
import { SecretSantaDisplay } from '@/components/secret-santa/SecretSantaDisplay';
import { useState } from 'react';
import { SecretSanta, Participant } from '@/types';
import { generateSecretSantaAssignments } from '@/lib/secretSantaUtils';

export default function SecretSantaPage() {
  const { user } = useAuth();
  const [secretSantas, setSecretSantas] = useState<SecretSanta[]>([]);
  const [drawingId, setDrawingId] = useState<string | null>(null);

  const handleCreateDraw = async (name: string, participantsData: Omit<Participant, 'id'>[]) => {
    if (!user) return;

    const participants: Participant[] = participantsData.map((p, index) => ({
      ...p,
      id: `${Date.now()}-${index}`,
    }));

    const newSecretSanta: SecretSanta = {
      id: `${Date.now()}`,
      name,
      createdBy: user.uid,
      participants,
      assignments: [],
      createdAt: new Date(),
      isDrawn: false,
    };

    setSecretSantas([...secretSantas, newSecretSanta]);
  };

  const handlePerformDraw = async (secretSantaId: string) => {
    const secretSanta = secretSantas.find(s => s.id === secretSantaId);
    if (!secretSanta) return;

    setDrawingId(secretSantaId);

    try {
      const assignments = generateSecretSantaAssignments(secretSanta.participants);
      
      setSecretSantas(secretSantas.map(s => 
        s.id === secretSantaId 
          ? { ...s, assignments, isDrawn: true }
          : s
      ));
    } catch (error) {
      console.error('Error performing draw:', error);
      alert('Error al realizar el sorteo. Intenta de nuevo.');
    } finally {
      setDrawingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-red-700 mb-8">Sorteos de Amigo Secreto</h1>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <SecretSantaForm onCreateDraw={handleCreateDraw} />
            </div>
            <div className="lg:row-span-2">
              {secretSantas.length === 0 ? (
                <div className="border-2 border-dashed border-red-200 rounded-lg p-12 text-center text-gray-500">
                  <p className="text-lg">Aún no has creado ningún sorteo</p>
                  <p className="text-sm mt-2">Completa el formulario para crear tu primer sorteo</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {secretSantas.map((secretSanta) => (
                    <SecretSantaDisplay
                      key={secretSanta.id}
                      secretSanta={secretSanta}
                      onPerformDraw={() => handlePerformDraw(secretSanta.id)}
                      loading={drawingId === secretSanta.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
