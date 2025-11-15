import type { Role } from "./auth";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  departmentId: number | null;
  departmentName: string | null;
}

