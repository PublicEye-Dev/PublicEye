export interface Category {
  id: number;
  name: string;
  departmentId: number | null;
  departmentName: string | null;
}

export interface CategoryCreatePayload {
  name: string;
  departmentId: number | null;
}

