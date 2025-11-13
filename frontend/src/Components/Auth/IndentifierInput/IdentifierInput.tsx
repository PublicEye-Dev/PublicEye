import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../../Store/authStore";
import "./IdentifierInput.css";

const identifierSchema = z.object({
  identifier: z
    .string()
    .min(1, "Introdu email-ul sau numărul de telefon")
    .refine(
      (val) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isPhone = /^[0-9]{10,15}$/.test(val.replace(/\s/g, ""));
        return isEmail || isPhone;
      },
      { message: "Introdu email-ul sau numărul de telefon valid" }
    ),
});

type IdentifierFormData = z.infer<typeof identifierSchema>;

export default function IdentifierInput() {
  const { setIdentifier, requestOtp, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdentifierFormData>({
    resolver: zodResolver(identifierSchema),
  });

  const onSubmit = async (data: IdentifierFormData) => {
    setIdentifier(data.identifier); //salveaza identifier-ul in store

    await requestOtp(); //apeleaza functia din store care solicita OTP
  };

  return (
    <form className="identifier-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="identifier">Email sau număr de telefon</label>
        <input
          id="identifier"
          type="text"
          placeholder="Introdu email-ul sau numărul de telefon"
          {...register("identifier")}
          disabled={isLoading}
        />
        {errors.identifier && (
          <span className="error">{errors.identifier.message}</span>
        )}
        {error && <span className="error">{error}</span>}
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading}>
        Intră în cont
      </button>

      {isLoading && <span className="loading">Se trimite codul...</span>}
    </form>
  );
}
