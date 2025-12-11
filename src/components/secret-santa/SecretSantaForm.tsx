'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Participant } from '@/types';

interface SecretSantaFormProps {
  onCreateDraw: (name: string, participants: Omit<Participant, 'id'>[]) => Promise<void>;
}

export function SecretSantaForm({ onCreateDraw }: SecretSantaFormProps) {
  const [drawName, setDrawName] = useState('');
  const [participants, setParticipants] = useState<{ name: string; email: string }[]>([
    { name: '', email: '' },
    { name: '', email: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addParticipant = () => {
    setParticipants([...participants, { name: '', email: '' }]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 2) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const updateParticipant = (index: number, field: 'name' | 'email', value: string) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const validParticipants = participants.filter(p => p.name.trim() && p.email.trim());
    
    if (validParticipants.length < 2) {
      setError('Necesitas al menos 2 participantes');
      setLoading(false);
      return;
    }

    if (!drawName.trim()) {
      setError('Debes dar un nombre al sorteo');
      setLoading(false);
      return;
    }

    try {
      await onCreateDraw(drawName, validParticipants);
      setDrawName('');
      setParticipants([{ name: '', email: '' }, { name: '', email: '' }]);
    } catch (err: any) {
      setError(err.message || 'Error al crear el sorteo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-700">Crear Sorteo de Amigo Secreto</CardTitle>
        <CardDescription>Agrega los participantes y realiza el sorteo</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="drawName">Nombre del Sorteo</Label>
            <Input
              id="drawName"
              placeholder="Ej: Amigo Secreto Navidad 2025"
              value={drawName}
              onChange={(e) => setDrawName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Participantes</Label>
            {participants.map((participant, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Nombre"
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={participant.email}
                    onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                    required
                  />
                </div>
                {participants.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeParticipant(index)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={addParticipant}
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Participante
          </Button>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Sorteo'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
