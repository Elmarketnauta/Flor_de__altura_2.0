import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { supabaseAdmin } from "@/lib/supabase/server";

const clientId = process.env.GOOGLE_CLIENT_ID || "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const githubId = process.env.GITHUB_CLIENT_ID || "";
const githubSecret = process.env.GITHUB_CLIENT_SECRET || "";

export const authConfig: any = {
  providers: [
    Google({
      clientId,
      clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: githubId,
      clientSecret: githubSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Sign in with Supabase Auth
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        if (error || !data.user) {
          throw new Error("Invalid email or password");
        }

        // Fetch user profile
        const { data: userProfile } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        return {
          id: data.user.id,
          email: data.user.email,
          name: userProfile?.full_name,
          image: null,
          role: userProfile?.role || "customer",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (!user.email) return false;

      // For OAuth providers, create/update user profile
      if (account?.provider !== "credentials") {
        const { data: existingUser } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (!existingUser) {
          // Create new user profile for OAuth users
          await supabaseAdmin.from("users").insert([
            {
              id: user.id,
              email: user.email,
              full_name: user.name,
              role: "customer",
              country: "PE",
            },
          ]);
        }
      }

      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "customer";
      }

      return token;
    },
    async session({ session, token }: any) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: (token.role as string) || "customer",
        },
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
};
