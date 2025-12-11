import { Participant, SecretSantaAssignment } from '@/types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateSecretSantaAssignments(
  participants: Participant[]
): SecretSantaAssignment[] {
  if (participants.length < 2) {
    throw new Error('Se necesitan al menos 2 participantes');
  }

  let shuffled: Participant[];
  let isValid = false;
  let attempts = 0;
  const maxAttempts = 100;

  // Intentar generar una asignación válida (nadie se asigna a sí mismo)
  while (!isValid && attempts < maxAttempts) {
    shuffled = shuffleArray(participants);
    isValid = shuffled.every((p, i) => p.id !== participants[i].id);
    attempts++;
  }

  if (!isValid) {
    throw new Error('No se pudo generar una asignación válida');
  }

  const assignments: SecretSantaAssignment[] = participants.map((giver, index) => ({
    giverId: giver.id,
    receiverId: shuffled![index].id,
  }));

  return assignments;
}
