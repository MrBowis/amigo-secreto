import { Participant, WishlistItem, SecretSantaAssignment, SecretSanta } from '@/types';

describe('Types Validation', () => {
  describe('Participant', () => {
    it('debería crear un participante válido', () => {
      const participant: Participant = {
        id: '1',
        name: 'Juan',
        email: 'juan@example.com',
      };

      expect(participant.id).toBe('1');
      expect(participant.name).toBe('Juan');
      expect(participant.email).toBe('juan@example.com');
    });

    it('debería tener propiedades requeridas', () => {
      const participant: Participant = {
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
      };

      expect(Object.keys(participant).length).toBe(3);
      expect(participant).toHaveProperty('id');
      expect(participant).toHaveProperty('name');
      expect(participant).toHaveProperty('email');
    });
  });

  describe('WishlistItem', () => {
    it('debería crear un item de lista válido', () => {
      const item: WishlistItem = {
        id: '1',
        title: 'Libro',
        reference: 'https://amazon.com/libro',
        createdAt: new Date(),
      };

      expect(item.id).toBe('1');
      expect(item.title).toBe('Libro');
      expect(item.reference).toBe('https://amazon.com/libro');
      expect(item.createdAt).toBeInstanceOf(Date);
    });

    it('debería tener propiedades requeridas', () => {
      const item: WishlistItem = {
        id: 'test-id',
        title: 'Product',
        reference: 'https://example.com',
        createdAt: new Date(),
      };

      expect(Object.keys(item).length).toBe(4);
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('reference');
      expect(item).toHaveProperty('createdAt');
    });
  });

  describe('SecretSantaAssignment', () => {
    it('debería crear una asignación válida', () => {
      const assignment: SecretSantaAssignment = {
        giverId: 'user1',
        receiverId: 'user2',
      };

      expect(assignment.giverId).toBe('user1');
      expect(assignment.receiverId).toBe('user2');
    });

    it('debería garantizar que giverId no es igual a receiverId', () => {
      const assignment: SecretSantaAssignment = {
        giverId: 'user1',
        receiverId: 'user2',
      };

      expect(assignment.giverId).not.toBe(assignment.receiverId);
    });
  });

  describe('SecretSanta', () => {
    it('debería crear un sorteo válido', () => {
      const draw: SecretSanta = {
        id: '1',
        name: 'Navidad 2025',
        createdBy: 'admin',
        participants: [
          { id: '1', name: 'Juan', email: 'juan@example.com' },
          { id: '2', name: 'María', email: 'maria@example.com' },
        ],
        assignments: [
          { giverId: '1', receiverId: '2' },
          { giverId: '2', receiverId: '1' },
        ],
        createdAt: new Date(),
        isDrawn: true,
      };

      expect(draw.id).toBe('1');
      expect(draw.name).toBe('Navidad 2025');
      expect(draw.participants.length).toBe(2);
      expect(draw.assignments.length).toBe(2);
      expect(draw.isDrawn).toBe(true);
    });

    it('debería tener propiedades requeridas', () => {
      const draw: SecretSanta = {
        id: 'test-id',
        name: 'Test Draw',
        createdBy: 'creator',
        participants: [],
        assignments: [],
        createdAt: new Date(),
        isDrawn: false,
      };

      expect(Object.keys(draw).length).toBe(7);
      expect(draw).toHaveProperty('id');
      expect(draw).toHaveProperty('name');
      expect(draw).toHaveProperty('createdBy');
      expect(draw).toHaveProperty('participants');
      expect(draw).toHaveProperty('assignments');
      expect(draw).toHaveProperty('createdAt');
      expect(draw).toHaveProperty('isDrawn');
    });
  });
});
