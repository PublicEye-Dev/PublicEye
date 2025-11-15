export type PetitionStatus = "ACTIVE" | "CLOSED" | "BANNED";

export interface Petition {
  id: number;
  title: string;
  receiver: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  problem: string;
  solution: string;
  officialResponse?: string | null;
  votes: number;
  userId?: number | null;
  userFullName?: string | null;
  userContact?: string | null;
  status?: PetitionStatus;
  createdAt?: string;
}

export interface PetitionUpdatePayload {
  status: PetitionStatus;
  officialResponse: string;
}

