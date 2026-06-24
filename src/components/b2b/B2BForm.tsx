"use client";

import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { b2bLeadSchema, type B2BLead } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function B2BForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [leadName, setLeadName] = useState("");
  const [subscribedNewsletter, setSubscribedNewsletter] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<B2BLead>({
    resolver: zodResolver(b2bLeadSchema),
    mode: "onBlur",
    defaultValues: { newsletter: true },
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

      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "generate_lead_b2b",
          lead_company: data.company,
          lead_channel: "b2b_form",
          newsletter_opt_in: data.newsletter ?? false,
        });
      }

      setLeadName(data.contactName.split(" ")[0] ?? "");
      setSubscribedNewsletter(data.newsletter ?? false);
      setStatus("success");
      reset();
    } catch (err) {
      console.error("[B2BForm]", err);
      setStatus("error");
    }
  };

  return (
    <div className="relative rounded-2xl bg-cream p-6 shadow-card sm:p-8">
      <AnimatePresence mode="wait">

        {/* ── Estado de éxito ── */}
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-6 text-center"
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
              ¡Solicitud recibida!
            </h3>
            <p className="mt-2 max-w-sm text-espresso-500">
              Gracias{leadName ? `, ${leadName}` : ""}. Revisaremos tu solicitud
              y te contactaremos en las próximas 24 horas para coordinar los
              detalles.
            </p>

            {/* Propuesta de newsletter */}
            {subscribedNewsletter ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/8 px-4 py-3 text-left"
              >
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-dark" />
                <p className="text-sm text-espresso-600">
                  <span className="font-semibold text-espresso-800">Ya estás suscrito al newsletter.</span>
                  {" "}Recibirás guías de preparación, novedades de cosecha y contenido
                  SCA de la Selva Central directamente en tu correo.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 w-full rounded-xl border border-sand bg-white px-4 py-4 text-left"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-gold-dark">
                  Mientras esperas
                </p>
                <p className="mt-1 font-serif text-base text-espresso-800">
                  Suscríbete al newsletter de café de especialidad
                </p>
                <p className="mt-1 text-xs text-espresso-500">
                  Guías de extracción, novedades de cosecha y cultura del café
                  desde la Selva Central — sin spam, sin compromiso.
                </p>
                <a
                  href="mailto:hola@flordealtura.com?subject=Quiero%20suscribirme%20al%20newsletter"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark underline-offset-2 hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Suscribirme al newsletter
                </a>
              </motion.div>
            )}

            <button
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm font-medium text-espresso-400 underline-offset-4 hover:underline"
            >
              Enviar otra solicitud
            </button>
          </motion.div>

        ) : (

          /* ── Formulario ── */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="font-serif text-2xl text-espresso-800">
              Prueba el Plan Oficina
            </h3>
            <p className="mt-2 text-sm text-espresso-500">
              Completa el formulario y un especialista te contactará para diseñar
              el programa de café para tu equipo.
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
                id="email"
                label="Correo Electrónico"
                type="email"
                inputMode="email"
                placeholder="Ej. andrea@startup.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
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

              {/* Checkbox newsletter */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sand bg-white px-4 py-3 transition hover:border-gold/50">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 flex-shrink-0 accent-gold-dark"
                  {...register("newsletter")}
                />
                <span className="text-sm text-espresso-600">
                  <span className="font-medium text-espresso-800">
                    Suscribirme al newsletter de café de especialidad
                  </span>
                  <span className="ml-1 text-espresso-400">
                    — guías de extracción, novedades de cosecha y contenido SCA.
                    Sin spam.
                  </span>
                </span>
              </label>

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
                  "Solicitar información"
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
