export type PetitionStatus = "ACTIVE" | "CLOSED" | "BANNED";

export interface Petition {
  id: number;
  title: string;
  receiver: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  problem: string;
  solution: string;
  status?: PetitionStatus | string;
  createdAt?: string;
  officialResponse?: string | null;
  votes: number;
  userId?: number | null;
  userFullName?: string | null;
  userContact?: string | null;
}

export interface PetitionCreateRequest {
  title: string;
  receiver: string;
  problem: string;
  solution: string;
  userId?: number;
}

export interface PetitionVoteRequest {
  signerName: string;
}

