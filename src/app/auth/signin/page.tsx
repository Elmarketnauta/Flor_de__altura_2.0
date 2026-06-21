"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/perfil";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      router.push(callbackUrl);
    }

    setLoading(false);
  };

  const handleOAuthSignIn = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cream to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl border border-sand/20 shadow-lg p-8">
          <h1 className="text-3xl font-playfair font-bold text-espresso mb-2">
            Bienvenido de Vuelta
          </h1>
          <p className="text-sand mb-8">Inicia sesión en tu cuenta</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-espresso mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-sand/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-espresso mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-sand/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold/90 disabled:bg-sand text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sand/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-sand">O continúa con</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthSignIn("google")}
              className="w-full border border-sand/30 text-espresso hover:bg-cream py-2 rounded-lg transition font-medium"
            >
              Google
            </button>
            <button
              onClick={() => handleOAuthSignIn("github")}
              className="w-full border border-sand/30 text-espresso hover:bg-cream py-2 rounded-lg transition font-medium"
            >
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-sand">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/signup" className="font-semibold text-gold hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
