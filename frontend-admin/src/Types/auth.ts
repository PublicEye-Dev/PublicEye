export type Role = "ADMIN" | "OPERATOR";

export type AdminAuthState = {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  role: Role | null;
};

export interface AdministrationLoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: Role;
}

