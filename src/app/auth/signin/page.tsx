"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/perfil";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Correo o contraseña incorrectos. Verifica tus datos.");
    } else if (result?.ok) {
      router.push(callbackUrl);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cream to-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-sand/30 bg-white p-8 shadow-card">
          {/* Logo / brand */}
          <div className="mb-6 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-gold-dark">
              Flor de Altura
            </p>
            <h1 className="mt-2 font-serif text-2xl text-espresso-900">
              Bienvenido de vuelta
            </h1>
            <p className="mt-1 text-sm text-espresso-500">Inicia sesión en tu cuenta</p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-espresso-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(
                  "w-full rounded-lg border border-sand bg-white px-4 py-2.5 text-espresso-800 outline-none transition placeholder:text-espresso-300 focus:border-gold focus:ring-2 focus:ring-gold/30",
                )}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-espresso-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={cn(
                  "w-full rounded-lg border border-sand bg-white px-4 py-2.5 text-espresso-800 outline-none transition placeholder:text-espresso-300 focus:border-gold focus:ring-2 focus:ring-gold/30",
                )}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-espresso-800 px-6 py-3.5 font-semibold text-cream transition hover:bg-espresso-900 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Iniciando sesión…</>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-espresso-400">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/signup" className="font-semibold text-gold-dark hover:underline">
              Crear cuenta gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
