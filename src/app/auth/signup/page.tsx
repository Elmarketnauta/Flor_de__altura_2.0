"use client";

import { forwardRef, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, Mail, Star } from "lucide-react";
import Link from "next/link";
import { signupStep1Schema, type SignupStep1 } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Step = "data" | "verify" | "welcome";

const SLIDE = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.25 },
};

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("data");
  const [pendingEmail, setPendingEmail] = useState("");
  const [savedData, setSavedData] = useState<SignupStep1 | null>(null);
  const [verifyError, setVerifyError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Step 1: datos personales ──────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupStep1>({
    resolver: zodResolver(signupStep1Schema),
    mode: "onBlur",
  });

  const onStep1Submit = async (data: SignupStep1) => {
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al enviar el código.");
      setSavedData(data);
      setPendingEmail(data.email);
      setStep("verify");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verificación OTP ──────────────────────────────────────────────
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleDigitChange = (idx: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = cleaned;
    setDigits(next);
    if (cleaned && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleDigitKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const onVerify = async () => {
    const code = digits.join("");
    if (code.length !== 6) {
      setVerifyError("Ingresa los 6 dígitos del código.");
      return;
    }
    setLoading(true);
    setVerifyError("");
    try {
      // Verify code
      const verifyRes = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, code }),
      });
      const verifyJson = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyJson.error ?? "Código incorrecto.");

      // Complete signup
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: savedData!.firstName,
          lastName: savedData!.lastName,
          dni: savedData!.dni,
          address: savedData!.address,
          email: pendingEmail,
          password: savedData!.password,
          verificationCode: code,
        }),
      });
      const signupJson = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupJson.error ?? "Error al crear la cuenta.");

      // Auto sign-in
      const result = await signIn("credentials", {
        email: pendingEmail,
        password: savedData!.password,
        redirect: false,
      });
      if (!result?.ok) throw new Error("Error al iniciar sesión automáticamente.");

      setStep("welcome");
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setVerifyError("");
    setDigits(["", "", "", "", "", ""]);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail }),
      });
      if (!res.ok) {
        const j = await res.json();
        setVerifyError(j.error ?? "No se pudo reenviar el código.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: bienvenida ────────────────────────────────────────────────────
  const onGoToProfile = () => router.push("/perfil");

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cream to-white px-4 py-12">
      <div className="w-full max-w-md">

        {/* Progress dots */}
        {step !== "welcome" && (
          <div className="mb-8 flex items-center justify-center gap-3">
            {(["data", "verify"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                  step === s
                    ? "bg-espresso-800 text-cream shadow-lg"
                    : step === "verify" && s === "data"
                    ? "bg-organic text-white"
                    : "bg-sand/40 text-espresso-400",
                )}>
                  {step === "verify" && s === "data" ? "✓" : i + 1}
                </div>
                {i === 0 && (
                  <div className={cn(
                    "h-0.5 w-12 rounded transition-all",
                    step === "verify" ? "bg-organic" : "bg-sand/40",
                  )} />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── PASO 1: Datos personales ── */}
          {step === "data" && (
            <motion.div key="data" {...SLIDE}>
              <div className="rounded-2xl border border-sand/30 bg-white p-8 shadow-card">
                <h1 className="font-serif text-2xl text-espresso-900">Crea tu cuenta</h1>
                <p className="mt-1 text-sm text-espresso-500">
                  Únete y acumula puntos en cada pedido.
                </p>

                {submitError && (
                  <div className="mt-4 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onStep1Submit)} noValidate className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      id="firstName"
                      label="Nombre"
                      placeholder="Andrea"
                      autoComplete="given-name"
                      error={errors.firstName?.message}
                      {...register("firstName")}
                    />
                    <Field
                      id="lastName"
                      label="Apellido"
                      placeholder="Morales"
                      autoComplete="family-name"
                      error={errors.lastName?.message}
                      {...register("lastName")}
                    />
                  </div>
                  <Field
                    id="dni"
                    label="DNI"
                    placeholder="12345678"
                    inputMode="numeric"
                    maxLength={8}
                    autoComplete="off"
                    error={errors.dni?.message}
                    {...register("dni")}
                  />
                  <Field
                    id="address"
                    label="Dirección de entrega"
                    placeholder="Av. Ejemplo 123, Miraflores, Lima"
                    autoComplete="street-address"
                    error={errors.address?.message}
                    {...register("address")}
                  />
                  <Field
                    id="email"
                    label="Correo electrónico"
                    type="email"
                    inputMode="email"
                    placeholder="andrea@ejemplo.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                  <Field
                    id="password"
                    label="Contraseña (mín. 8 caracteres)"
                    type="password"
                    autoComplete="new-password"
                    error={errors.password?.message}
                    {...register("password")}
                  />
                  <Field
                    id="confirmPassword"
                    label="Confirmar contraseña"
                    type="password"
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-espresso-800 px-6 py-3.5 font-semibold text-cream transition hover:bg-espresso-900 disabled:opacity-60"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Enviando código…</>
                    ) : (
                      <><ChevronRight className="h-4 w-4" /> Continuar</>
                    )}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-espresso-400">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/auth/signin" className="font-semibold text-gold-dark hover:underline">
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── PASO 2: Verificación OTP ── */}
          {step === "verify" && (
            <motion.div key="verify" {...SLIDE}>
              <div className="rounded-2xl border border-sand/30 bg-white p-8 shadow-card">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                  <Mail className="h-7 w-7 text-gold-dark" />
                </div>
                <h1 className="font-serif text-2xl text-espresso-900">Revisa tu correo</h1>
                <p className="mt-2 text-sm text-espresso-500">
                  Enviamos un código de 6 dígitos a{" "}
                  <span className="font-semibold text-espresso-700">{pendingEmail}</span>.
                  Expira en 10 minutos.
                </p>

                {verifyError && (
                  <div className="mt-4 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
                    {verifyError}
                  </div>
                )}

                {/* OTP inputs */}
                <div className="mt-6 flex justify-center gap-2">
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      onPaste={i === 0 ? handleDigitPaste : undefined}
                      className={cn(
                        "h-14 w-12 rounded-xl border-2 bg-cream text-center font-mono text-xl font-bold text-espresso-900 outline-none transition focus:border-gold focus:bg-white",
                        d ? "border-gold" : "border-sand",
                      )}
                    />
                  ))}
                </div>

                <button
                  onClick={onVerify}
                  disabled={loading || digits.join("").length !== 6}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-espresso-800 px-6 py-3.5 font-semibold text-cream transition hover:bg-espresso-900 disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Verificando…</>
                  ) : (
                    <><CheckCircle2 className="h-4 w-4" /> Verificar y crear cuenta</>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-between text-sm text-espresso-400">
                  <button
                    onClick={() => setStep("data")}
                    className="hover:text-espresso-700"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={onResend}
                    disabled={loading}
                    className="font-medium text-gold-dark hover:underline disabled:opacity-50"
                  >
                    Reenviar código
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PASO 3: Bienvenida ── */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-2xl border border-sand/30 bg-white p-8 shadow-card text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light"
                >
                  <Star className="h-10 w-10 text-espresso-900" />
                </motion.div>

                <h1 className="font-serif text-3xl text-espresso-900">
                  ¡Bienvenido a Flor de Altura!
                </h1>
                <p className="mt-3 text-espresso-500">
                  Tu cuenta está lista. Como regalo de bienvenida te hemos acreditado:
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mx-auto mt-6 w-fit rounded-2xl border border-gold/40 bg-gold/8 px-8 py-5"
                >
                  <p className="font-mono text-4xl font-bold text-espresso-800">50</p>
                  <p className="mt-1 text-sm font-medium text-gold-dark">puntos de bienvenida</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 rounded-xl bg-cream px-4 py-3 text-sm text-espresso-600"
                >
                  Cada S/ 1 que gastes = 1 punto. 100 puntos = S/ 5 de descuento.
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={onGoToProfile}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-espresso-800 px-6 py-3.5 font-semibold text-cream transition hover:bg-espresso-900"
                >
                  Ver mi perfil y puntos →
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Campo de formulario reutilizable ──────────────────────────────────────────

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ id, label, error, ...props }, ref) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-espresso-700">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full rounded-lg border bg-white px-4 py-2.5 text-espresso-800 outline-none transition placeholder:text-espresso-300 focus:ring-2",
          error
            ? "border-terracotta focus:ring-terracotta/30"
            : "border-sand focus:border-gold focus:ring-gold/30",
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-terracotta">
          {error}
        </p>
      )}
    </div>
  ),
);
Field.displayName = "Field";
