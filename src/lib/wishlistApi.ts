import { apiClient } from './api';
import { Wishlist, WishlistItem } from '@/types';

export interface WishlistRequest {
  user: string;
  email?: string;
  items: Array<{
    title: string;
    reference: string;
  }>;
}

export interface WishlistResponse {
  id: number;
  user: string;
  email?: string;
  items: Array<{
    id: number;
    title: string;
    reference: string;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

class WishlistService {
  private readonly basePath = '/wishlist/wishlists';

  async getWishlist(userId: string): Promise<Wishlist | null> {
    try {
      const response = await apiClient.get<WishlistResponse[]>(
        `${this.basePath}/?user=${userId}`
      );
      
      if (response.length === 0) {
        return null;
      }
      
      return this.mapToWishlist(response[0]);
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async saveWishlist(data: WishlistRequest): Promise<Wishlist> {
    const response = await apiClient.post<WishlistResponse>(
      `${this.basePath}/`,
      data
    );
    return this.mapToWishlist(response);
  }

  async updateWishlist(wishlistId: number, data: WishlistRequest): Promise<Wishlist> {
    const response = await apiClient.put<WishlistResponse>(
      `${this.basePath}/${wishlistId}/`,
      data
    );
    return this.mapToWishlist(response);
  }

  private mapToWishlist(response: WishlistResponse): Wishlist {
    return {
      id: response.id.toString(),
      userId: response.user,
      items: response.items.map(item => ({
        id: item.id.toString(),
        title: item.title,
        reference: item.reference,
        createdAt: new Date(item.created_at),
      })),
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
    };
  }
}

export const wishlistService = new WishlistService();
