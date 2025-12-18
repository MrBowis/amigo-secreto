import { shuffleArray, generateSecretSantaAssignments } from '@/lib/secretSantaUtils';
import { Participant } from '@/types';

describe('Secret Santa Utils', () => {
  describe('shuffleArray', () => {
    it('debería retornar un array del mismo tamaño', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(shuffled.length).toBe(original.length);
    });

    it('debería contener los mismos elementos', () => {
      const original = ['a', 'b', 'c'];
      const shuffled = shuffleArray(original);
      expect(shuffled.sort()).toEqual(original.sort());
    });

    it('no debería modificar el array original', () => {
      const original = [1, 2, 3];
      const originalCopy = [...original];
      shuffleArray(original);
      expect(original).toEqual(originalCopy);
    });

    it('debería manejar arrays de un solo elemento', () => {
      const single = [1];
      const shuffled = shuffleArray(single);
      expect(shuffled).toEqual([1]);
    });

    it('debería manejar arrays vacíos', () => {
      const empty: number[] = [];
      const shuffled = shuffleArray(empty);
      expect(shuffled).toEqual([]);
    });

    it('debería distribuir los elementos aleatoriamente en múltiples llamadas', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffles = [
        shuffleArray(arr),
        shuffleArray(arr),
        shuffleArray(arr),
      ];
      // Al menos una de las permutaciones debería ser diferente del original
      const allSameAsOriginal = shuffles.every(s => 
        JSON.stringify(s) === JSON.stringify(arr)
      );
      // No es 100% garantizado pero muy improbable con 3 intentos
      expect(allSameAsOriginal).toBe(false);
    });
  });

  describe('generateSecretSantaAssignments', () => {
    const mockParticipants: Participant[] = [
      { id: '1', name: 'Alice', email: 'alice@example.com' },
      { id: '2', name: 'Bob', email: 'bob@example.com' },
      { id: '3', name: 'Charlie', email: 'charlie@example.com' },
      { id: '4', name: 'Diana', email: 'diana@example.com' },
    ];

    it('debería lanzar error con menos de 2 participantes', () => {
      expect(() => generateSecretSantaAssignments([])).toThrow(
        'Se necesitan al menos 2 participantes'
      );
      expect(() => generateSecretSantaAssignments([mockParticipants[0]])).toThrow(
        'Se necesitan al menos 2 participantes'
      );
    });

    it('debería generar asignaciones para 2 participantes', () => {
      const assignments = generateSecretSantaAssignments(
        mockParticipants.slice(0, 2)
      );
      expect(assignments.length).toBe(2);
      expect(assignments[0].giverId).not.toBe(assignments[0].receiverId);
      expect(assignments[1].giverId).not.toBe(assignments[1].receiverId);
    });

    it('debería generar asignaciones para múltiples participantes', () => {
      const assignments = generateSecretSantaAssignments(mockParticipants);
      expect(assignments.length).toBe(mockParticipants.length);
    });

    it('debería asegurar que nadie se asigna a sí mismo', () => {
      const assignments = generateSecretSantaAssignments(mockParticipants);
      assignments.forEach(assignment => {
        expect(assignment.giverId).not.toBe(assignment.receiverId);
      });
    });

    it('debería asegurar que todos los participantes dan un regalo', () => {
      const assignments = generateSecretSantaAssignments(mockParticipants);
      const giverIds = assignments.map(a => a.giverId).sort();
      const participantIds = mockParticipants.map(p => p.id).sort();
      expect(giverIds).toEqual(participantIds);
    });

    it('debería asegurar que todos los participantes reciben un regalo', () => {
      const assignments = generateSecretSantaAssignments(mockParticipants);
      const receiverIds = assignments.map(a => a.receiverId).sort();
      const participantIds = mockParticipants.map(p => p.id).sort();
      expect(receiverIds).toEqual(participantIds);
    });

    it('debería funcionar correctamente con muchos participantes', () => {
      const manyParticipants: Participant[] = Array.from({ length: 20 }, (_, i) => ({
        id: `${i}`,
        name: `Person ${i}`,
        email: `person${i}@example.com`,
      }));
      const assignments = generateSecretSantaAssignments(manyParticipants);
      expect(assignments.length).toBe(20);
      assignments.forEach(assignment => {
        expect(assignment.giverId).not.toBe(assignment.receiverId);
      });
    });
  });
});
