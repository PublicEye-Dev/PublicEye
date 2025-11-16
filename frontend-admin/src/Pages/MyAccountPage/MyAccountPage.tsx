import { useEffect, useMemo, useState } from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import axios, { isAxiosError } from "axios";
import "./MyAccountPage.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

const adminApi = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

adminApi.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("admin-auth-storage");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("admin-auth-storage");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

type UserDto = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  departmentId?: number | null;
  departmentName?: string | null;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const payload = error.response?.data;
    if (typeof payload === "string") {
      return payload;
    }
    if (payload && typeof payload === "object" && "message" in payload) {
      const maybeMessage = (payload as Record<string, unknown>).message;
      if (typeof maybeMessage === "string") {
        return maybeMessage;
      }
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

const MyAccountPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Profile details
  const [user, setUser] = useState<UserDto | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const isProfilePristine = useMemo(() => {
    if (!user) return true;
    return (
      (fullName ?? "") === (user.fullName ?? "") &&
      (email ?? "") === (user.email ?? "") &&
      (phoneNumber ?? "") === (user.phoneNumber ?? "")
    );
  }, [user, fullName, email, phoneNumber]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const loadMe = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await adminApi.get<UserDto>("/api/account/info");
      const u = resp.data;
      setUser(u);
      setFullName(u.fullName ?? "");
      setEmail(u.email ?? "");
      setPhoneNumber(u.phoneNumber ?? "");
    } catch (err) {
      setError(getErrorMessage(err, "Nu s-au putut încărca datele contului."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadMe();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    setError(null);
    setSuccess(null);
    try {
      // Backend așteaptă UserDto în body
      const payload: UserDto = {
        id: user.id,
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || "",
        role: user.role,
        departmentId: user.departmentId ?? null,
        departmentName: user.departmentName ?? null,
      };
      const resp = await adminApi.put<UserDto>("/api/account/update-info", payload);
      setUser(resp.data);
      setFullName(resp.data.fullName ?? "");
      setEmail(resp.data.email ?? "");
      setPhoneNumber(resp.data.phoneNumber ?? "");
      setSuccess("Detaliile au fost salvate cu succes.");
    } catch (err) {
      setError(getErrorMessage(err, "Nu s-au putut salva detaliile."));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setError(null);
    setSuccess(null);
    try {
      if (!newPassword || newPassword.length < 8) {
        throw new Error("Parola nouă trebuie să conțină cel puțin 8 caractere.");
      }
      await adminApi.put("/api/account/update-password", {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      setSuccess("Parola a fost schimbată cu succes.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(getErrorMessage(err, "Nu s-a putut schimba parola."));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="manage-report-page-container">
      <div className="manage-report-page-header">
        <Navbar />
      </div>
      <div className="manage-report-page-content">
        <div className="my-account-card">
          <h2>Contul meu</h2>
          {error && <p className="categories-error">{error}</p>}
          {success && <p className="categories-success">{success}</p>}
          {isLoading ? (
            <div>Se încarcă datele contului...</div>
          ) : (
            <div className="my-account-grid">
              <form className="my-account-section" onSubmit={handleSaveProfile}>
                <h3>Detalii profil</h3>
                <div className="form-group">
                  <label htmlFor="acc-name">Nume</label>
                  <input
                    id="acc-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isSavingProfile}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="acc-email">Email</label>
                  <input
                    id="acc-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSavingProfile}
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="acc-phone">Număr de telefon</label>
                  <input
                    id="acc-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isSavingProfile}
                    autoComplete="tel"
                  />
                </div>
                <button
                  type="submit"
                  className="button-salvare"
                  disabled={isSavingProfile || isProfilePristine}
                >
                  {isSavingProfile ? "Se salvează..." : "Salvează Detaliile"}
                </button>
              </form>

              <form className="my-account-section my-account-password" onSubmit={handleChangePassword}>
                <h3>Schimbă parola</h3>
                <div className="form-group">
                  <label htmlFor="acc-current-pass">Parolă curentă</label>
                  <input
                    id="acc-current-pass"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isChangingPassword}
                    autoComplete="current-password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="acc-new-pass">Parolă nouă</label>
                  <input
                    id="acc-new-pass"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  className="button-salvare"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Se schimbă..." : "Schimbă Parola"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;


