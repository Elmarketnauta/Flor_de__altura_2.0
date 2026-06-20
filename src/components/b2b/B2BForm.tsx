"use client";

import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { b2bLeadSchema, type B2BLead } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function B2BForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [leadName, setLeadName] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<B2BLead>({
    resolver: zodResolver(b2bLeadSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: B2BLead) => {
    setStatus("submitting");

    try {
      const res = await fetch("/api/b2b-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Respuesta ${res.status}`);

      // Evento para la capa de datos (GTM → BigQuery → Looker).
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "generate_lead_b2b",
          lead_company: data.company,
          lead_channel: "b2b_form",
        });
      }

      setLeadName(data.contactName.split(" ")[0] ?? "");
      setStatus("success");
      reset();
    } catch (error) {
      console.error("[B2BForm] Error al enviar el lead:", error);
      setStatus("error");
    }
  };

  return (
    <div className="relative rounded-2xl bg-cream p-6 shadow-card sm:p-8">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-8 text-center"
            data-layer="b2b_lead_success"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-organic/10"
            >
              <CheckCircle2 className="h-9 w-9 text-organic" />
            </motion.div>
            <h3 className="font-serif text-2xl text-espresso-800">
              ¡Cata Gratis Agendada!
            </h3>
            <p className="mt-2 max-w-sm text-espresso-500">
              Gracias{leadName ? `, ${leadName}` : ""}. Recibimos tu solicitud y
              te contactaremos muy pronto para coordinar la cata guiada en tu
              oficina. ☕
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm font-medium text-gold-dark underline-offset-4 hover:underline"
            >
              Enviar otra solicitud
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="font-serif text-2xl text-espresso-800">
              Prueba el Plan Gratis
            </h3>
            <p className="mt-2 text-sm text-espresso-500">
              Completa el formulario y solicita una tarde de café y cata guiada
              gratis para un equipo de hasta 15 colaboradores.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-6 space-y-4"
              data-layer="b2b_lead_form"
            >
              <Field
                id="company"
                label="Nombre de la Empresa"
                placeholder="Ej. Startup SAC"
                autoComplete="organization"
                error={errors.company?.message}
                {...register("company")}
              />
              <Field
                id="contactName"
                label="Tu Nombre y Apellido"
                placeholder="Ej. Andrea Morales"
                autoComplete="name"
                error={errors.contactName?.message}
                {...register("contactName")}
              />
              <Field
                id="phone"
                label="Teléfono de Contacto"
                type="tel"
                inputMode="numeric"
                placeholder="Ej. 998765432"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register("phone")}
              />

              {status === "error" && (
                <p
                  role="alert"
                  className="rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
                >
                  No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo
                  nuevamente.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                data-layer="submit_lead_b2b"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 font-semibold text-cream shadow-card transition hover:bg-terracotta-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  "Agendar Cata Gratis"
                )}
              </button>

              <p className="text-center text-xs text-espresso-400">
                Sin compromiso. Respetamos tus datos según la Ley N.º 29733.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

/** Campo de formulario accesible con estado de error. forwardRef para RHF. */
const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ id, label, error, ...props }, ref) => (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-espresso-700"
      >
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
