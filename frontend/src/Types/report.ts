export type Status =
  | "DEPUSA"
  | "PLANIFICATA"
  | "IN_LUCRU"
  | "REZOLVATA"
  | "REDIRECTIONATA";

export interface Report {
  id: number;
  description: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  votes: number;
  status: Status;
  latitude: number;
  longitude: number;
  categoryId: number;
  categoryName?: string;
  subcategoryId: number;
  subcategoryName?: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReportCreateRequest {
  description: string;
  categoryId: number;
  subcategoryId: number;
  userId: number;
  latitude: number;
  longitude: number;
}

export interface ReportListParams {
  status?: Status[];
  period?: string;
}

export interface ReportIssue {
  id: string;
  title: string;
  status: Status;
  position: [number, number];
  votes: number;
  description: string;
  imageUrl: string | null;
  updatedAtLabel?: string;
  categoryName?: string;
}

