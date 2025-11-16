export type Role = "USER" | "OPERATOR" | "ADMIN";

export interface UserDto {
  id: number;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  role: Role;
  departmentId: number | null;
  departmentName: string | null;
}

