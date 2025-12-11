export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

export interface WishlistItem {
  id: string;
  title: string;
  reference: string;
  createdAt: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
}

export interface SecretSantaAssignment {
  giverId: string;
  receiverId: string;
}

export interface SecretSanta {
  id: string;
  name: string;
  createdBy: string;
  participants: Participant[];
  assignments: SecretSantaAssignment[];
  createdAt: Date;
  isDrawn: boolean;
}
