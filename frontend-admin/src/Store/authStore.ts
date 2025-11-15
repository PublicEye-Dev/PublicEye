import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminAuthState, Role } from "../Types/auth";
import { loginAdministration } from "../Services/api";

interface AuthStore extends AdminAuthState {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const initialState: AdminAuthState = {
  email: "",
  password: "",
  isLoading: false,
  error: null,
  token: null,
  role: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setEmail: (email) => set({ email, error: null }),
      setPassword: (password) => set({ password, error: null }),
      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginAdministration({ email, password });
          set({
            token: response.token,
            role: response.role as Role,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Autentificarea a eșuat",
            isLoading: false,
          });
        }
      },
      logout: () => set({ ...initialState }),
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({
        token: state.token,
        role: state.role,
      }),
    }
  )
);

