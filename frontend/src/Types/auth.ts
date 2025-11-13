export type AuthStep =
  | "idle"
  | "waiting-code"
  | "verifying-code"
  | "authenticated";

export type Role = "USER";

export type AuthState = {
  step: AuthStep;
  identifier: string;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  role: Role | null;
};

export interface OtpRequest {
  identifier: string;
}

export interface OtpVerifyRequest {
  identifier: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  role: Role;
}
