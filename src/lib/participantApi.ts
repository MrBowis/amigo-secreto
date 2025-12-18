import { apiClient } from './api';

export interface ParticipantEvent {
  id: number;
  name: string;
  created_at: string;
  participant: {
    id: number;
    name: string;
    email: string;
  };
  assignment: {
    receiver_id: number;
    receiver_name: string;
    receiver_email: string;
  } | null;
}

export interface EventParticipantWithWishlist {
  id: number;
  name: string;
  email: string;
  wishlist: {
    id: number;
    items: Array<{
      id: number;
      title: string;
      reference: string;
    }>;
  } | null;
}

class ParticipantService {
  async getMyEvents(email: string): Promise<ParticipantEvent[]> {
    return apiClient.get<ParticipantEvent[]>(
      `/secret-santa/events/by_participant/?email=${encodeURIComponent(email)}`
    );
  }

  async getEventParticipantsWithWishlists(
    eventId: number,
    myEmail: string
  ): Promise<EventParticipantWithWishlist[]> {
    return apiClient.get<EventParticipantWithWishlist[]>(
      `/secret-santa/events/${eventId}/participants_wishlists/?email=${encodeURIComponent(myEmail)}`
    );
  }
}

export const participantService = new ParticipantService();
