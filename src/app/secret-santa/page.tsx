'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { SecretSantaForm } from '@/components/secret-santa/SecretSantaForm';
import { SecretSantaDisplay } from '@/components/secret-santa/SecretSantaDisplay';
import { useState, useEffect } from 'react';
import { SecretSanta, Participant } from '@/types';
import { secretSantaService } from '@/lib/secretSantaApi';

export default function SecretSantaPage() {
  const { user } = useAuth();
  const [secretSantas, setSecretSantas] = useState<SecretSanta[]>([]);
  const [drawingId, setDrawingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadSecretSantas();
    }
  }, [user]);

  const loadSecretSantas = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const events = await secretSantaService.getEvents(user.uid);
      setSecretSantas(events);
      setError('');
    } catch (err: any) {
      console.error('Error loading secret santas:', err);
      setError('Error al cargar los sorteos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDraw = async (name: string, participantsData: Omit<Participant, 'id'>[]) => {
    if (!user) return;

    try {
      const newEvent = await secretSantaService.createEvent({
        name,
        created_by: user.uid,
        participants: participantsData,
      });

      setSecretSantas([newEvent, ...secretSantas]);
    } catch (err: any) {
      console.error('Error creating draw:', err);
      throw new Error(err.message || 'Error al crear el sorteo');
    }
  };

  const handlePerformDraw = async (secretSantaId: string) => {
    setDrawingId(secretSantaId);

    try {
      const updatedEvent = await secretSantaService.performDraw(parseInt(secretSantaId));
      
      setSecretSantas(secretSantas.map(s => 
        s.id === secretSantaId ? updatedEvent : s
      ));
    } catch (error: any) {
      console.error('Error performing draw:', error);
      alert(error.message || 'Error al realizar el sorteo. Intenta de nuevo.');
    } finally {
      setDrawingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-red-700 mb-8">Sorteos de Amigo Secreto</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <SecretSantaForm onCreateDraw={handleCreateDraw} />
            </div>
            <div className="lg:row-span-2">
              {loading ? (
                <div className="border-2 border-dashed border-red-200 rounded-lg p-12 text-center text-gray-500">
                  <p className="text-lg">Cargando sorteos...</p>
                </div>
              ) : secretSantas.length === 0 ? (
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
