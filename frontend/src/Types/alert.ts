export interface Alerta {
  id: number;
  tipPericol: string;
  zona: string;
  descriere: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface AlertaIssue {
  id: string;
  tipPericol: string;
  zona: string;
  descriere: string;
  position: [number, number];
}

