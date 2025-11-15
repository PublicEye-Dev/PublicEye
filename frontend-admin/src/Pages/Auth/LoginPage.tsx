import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../Store/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import Navbar from "../../Components/Layout/Navbar/Navbar";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("E-mailul este obligatoriu")
    .email("Introdu un e-mail valid"),
  password: z
    .string()
    .min(6, "Parola trebuie să conțină cel puțin 6 caractere"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role, login, error, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirectPath =
    (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    if (token && role) {
      navigate(redirectPath, { replace: true });
    }
  }, [token, role, navigate, redirectPath]);

  const onSubmit = handleSubmit(async (data) => {
    await login(data);
  });

  return (
    <div className="login-page-container">
      <header className="login-navbar">
        <Navbar />
      </header>

      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1>Autentificare administrație</h1>
            <p>Introdu e-mailul și parola alocate de Primăria Timișoara.</p>
          </div>

          <form className="admin-login-form" onSubmit={onSubmit} noValidate>
            <label className="admin-login-label">
              Adresă de e-mail
              <input
                type="email"
                placeholder="Introduceți adresa de email"
                {...register("email")}
                className={errors.email ? "has-error" : ""}
              />
              {errors.email && (
                <span className="admin-login-error">
                  {errors.email.message}
                </span>
              )}
            </label>

            <label className="admin-login-label">
              Parolă
              <input
                type="password"
                placeholder="Introduceți parola"
                {...register("password")}
                className={errors.password ? "has-error" : ""}
              />
              {errors.password && (
                <span className="admin-login-error">
                  {errors.password.message}
                </span>
              )}
            </label>

            {error && <div className="admin-login-alert">{error}</div>}

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Se autentifică..." : "Intră în platformă"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
