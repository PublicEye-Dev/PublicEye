import { z } from "zod";
import { useAuthStore } from "../../../Store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./CodeInput.css";

const codeSchema = z.object({
  code: z.string().length(6, "Codul trebuie să aibă 6 cifre"),
});

type CodeFormData = z.infer<typeof codeSchema>;

export default function CodeInput() {
  const { identifier, requestOtp, verifyOtp, reset, isLoading, error } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
  });

  const onSubmit = async (data: CodeFormData) => {
    await verifyOtp(data.code); //apeleaza functia din store care verifica OTP
  };

  const handleResend = async () => {
    await requestOtp(); //retrimite codul
  };

  const handleBack = () => {
    reset(); //revenire la pasul anterior
  };

  return (
    <div className="code-form">
      <p className="info-text">
        Am trimis un cod de acces la <strong>{identifier}</strong>
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="code">Cod de acces (6 cifre)</label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            {...register("code")}
            disabled={isLoading}
            autoFocus
          />
          {errors.code && <span className="error">{errors.code.message}</span>}
          {error && <span className="error">{error}</span>}
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Se verifică..." : "Verifică cod"}
        </button>
      </form>

      <div className="form-actions">
        <button
          type="button"
          className="btn-link"
          onClick={handleResend}
          disabled={isLoading}
        >
          Retrimite cod
        </button>
        <button
          type="button"
          className="btn-link"
          onClick={handleBack}
          disabled={isLoading}
        >
          Înapoi
        </button>
      </div>
    </div>
  );
}
