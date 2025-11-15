export interface CategorySummary {
  id: number;
  name: string;
  description?: string | null;
}

export interface CategoryOption extends CategorySummary {
  departmentId?: number | null;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  categories: CategorySummary[];
}

export interface DepartmentCreatePayload {
  name: string;
  description: string;
  categories: string[];
}

export interface DepartmentUpdatePayload {
  name: string;
  description: string;
  categories: string[];
}

export interface DepartmentOperatorPayload {
  fullName: string;
  email: string;
  password: string;
  departmentId: number;
}

