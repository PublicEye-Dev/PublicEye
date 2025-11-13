export type Status =
  | "DEPUSA"
  | "PLANIFICATA"
  | "IN_LUCRU"
  | "REZOLVATA"
  | "REDIRECTIONATA";

//raspunsul de la backend
export interface Report {
  id: number;
  description: string;
  imageUrl: string;
  imagePublicId: string;
  votes: number;
  status: Status;
  latitude: number;
  longitude: number;
  categoryId: number;
  subcategoryId: number;
  userId: number;
}

//request-ul facut de frontend la backend
export interface ReportCreateRequest {
  description: string;
  categoryId: number;
  subcategoryId: number;
  userId: number;
  latitude: number;
  longitude: number;
}

//parametrii pentru lista de sesizari
export interface ReportListParams {
  status?: Status[];
  period?: string;
}

//format pentru raportul afisat pe mapa
export interface ReportIssue {
  id: string;
  title: string;
  status: Status;
  position: [number, number];
  votes: number;
  description: string;
  imageUrl: string;
}
