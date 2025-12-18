import { apiClient } from './api';
import { SecretSanta, Participant } from '@/types';

export interface CreateSecretSantaRequest {
  name: string;
  created_by: string;
  participants: { name: string; email: string }[];
}

export interface SecretSantaResponse {
  id: number;
  name: string;
  created_by: string;
  participants: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  assignments: Array<{
    giver_id: number;
    receiver_id: number;
  }>;
  is_drawn: boolean;
  created_at: string;
}

class SecretSantaService {
  private readonly basePath = '/secret-santa/events';

  async getEvents(userId: string): Promise<SecretSanta[]> {
    const response = await apiClient.get<SecretSantaResponse[]>(
      `${this.basePath}/?user=${userId}`
    );
    return response.map(this.mapToSecretSanta);
  }

  async createEvent(data: CreateSecretSantaRequest): Promise<SecretSanta> {
    const response = await apiClient.post<SecretSantaResponse>(
      `${this.basePath}/`,
      data
    );
    return this.mapToSecretSanta(response);
  }

  async performDraw(eventId: number): Promise<SecretSanta> {
    const response = await apiClient.post<SecretSantaResponse>(
      `${this.basePath}/${eventId}/draw/`
    );
    return this.mapToSecretSanta(response);
  }

  async getEvent(eventId: number): Promise<SecretSanta> {
    const response = await apiClient.get<SecretSantaResponse>(
      `${this.basePath}/${eventId}/`
    );
    return this.mapToSecretSanta(response);
  }

  private mapToSecretSanta(response: SecretSantaResponse): SecretSanta {
    return {
      id: response.id.toString(),
      name: response.name,
      createdBy: response.created_by,
      participants: response.participants.map(p => ({
        id: p.id.toString(),
        name: p.name,
        email: p.email,
      })),
      assignments: response.assignments.map(a => ({
        giverId: a.giver_id.toString(),
        receiverId: a.receiver_id.toString(),
      })),
      isDrawn: response.is_drawn,
      createdAt: new Date(response.created_at),
    };
  }
}

export const secretSantaService = new SecretSantaService();
