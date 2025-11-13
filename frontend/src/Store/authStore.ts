import { create } from "zustand";
import { persist } from "zustand/middleware";
import { requestOtp, verifyOtp } from "../Services/api";
import type { AuthState } from "../Types/auth";

interface AuthStore extends AuthState {
  setIdentifier: (identifier: string) => void;
  requestOtp: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  reset: () => void;
  logout: () => void;
}

const initialState: AuthState = {
  step: "idle",
  identifier: "",
  isLoading: false,
  error: null,
  token: null,
  role: null,
};

export const useAuthStore = create<AuthStore>()(
  //persist salveaza tokenul si rolul in localStorage(format necesar interceptorului)
  persist(
    (set, get) => ({
      ...initialState,

      setIdentifier: (identifier: string) => {
        set({ identifier, error: null });
      },

      requestOtp: async () => {
        const { identifier } = get();
        if (!identifier) {
          set({ error: "Introdu email-ul sau numărul de telefon" });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          //apeleaza functia din services/api.ts pentru a solicita OTP
          await requestOtp(identifier);

          //seteaza step-ul la waiting-code si isLoading-ul la false daca reuseste request-ul
          set({ step: "waiting-code", isLoading: false });
        } catch (error) {
          set({
            //seteaza error-ul si isLoading-ul la false daca nu reuseste request-ul
            error:
              error instanceof Error
                ? error.message
                : "Eroare la trimiterea codului",
            isLoading: false,
          });
        }
      },

      verifyOtp: async (otp: string) => {
        const { identifier } = get();
        if (!otp || otp.length !== 6) {
          set({ error: "Codul trebuie să aibă 6 cifre" });
          return;
        }

        set({ isLoading: true, error: null, step: "verifying-code" });

        try {
          //apeleaza functia din services/api.ts pentru a verifica OTP
          const response = await verifyOtp(identifier, otp);

          set({
            //seteaza step-ul la authenticated, token-ul si rolul din response si isLoading-ul la false daca reuseste verificarea
            step: "authenticated",
            token: response.token,
            role: response.role,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            //seteaza error-ul si isLoading-ul la false daca nu reuseste verificarea
            error:
              error instanceof Error
                ? error.message
                : "Eroare la verificarea codului",
            isLoading: false,
            step: "waiting-code",
          });
        }
      },

      reset: () => {
        //reseteaza store-ul la starea initiala si seteaza identifier-ul la valoarea curenta
        set({ ...initialState, identifier: get().identifier });
      },

      logout: () => {
        //reseteaza store-ul la starea initiala (sterge tot)
        set(initialState);
      },
    }),
    {
      name: "auth-storage",
      //salveaza doar token-ul si rolul in localStorage
      partialize: (state: AuthStore) => ({
        token: state.token,
        role: state.role,
      }),
    }
  )
);
