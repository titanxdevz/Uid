import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@/types";

declare module "next-auth" {
  interface User {
    role: Role;
    credits: number;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
      credits: number;
    };
  }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { connectDB } = await import("./db");
        const User = (await import("./models/User")).default;
        const bcrypt = (await import("bcryptjs")).default;

        await connectDB();

        const user = await User.findOne({ email: credentials.email as string }).select("+password");

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;

        if (!user.isActive) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          credits: user.credits,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const t = token as unknown as Record<string, unknown>;
        t.id = user.id;
        t.role = user.role;
        t.credits = user.credits;
      }
      return token;
    },
    async session({ session, token }) {
      const t = token as unknown as Record<string, unknown>;
      const s = session.user as unknown as Record<string, unknown>;
      s.id = t.id as string;
      s.role = t.role;
      s.credits = t.credits;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
