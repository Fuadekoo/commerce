import NextAuth from "next-auth";
import prisma from "./db";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./zodSchema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);
        if (!result.success) {
          throw new Error("Invalid credentials");
        }
        // Find user by phone and password
        const user = await prisma.user.findUnique({
          where: {
            phone: result.data.phone,
            password: result.data.password,
          },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }
        // Only return id, phone, and email for session
        return {
          id: user.id,
          phone: user.phone,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // token.phone = user.;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      // session.user.phone = token.phone;
      session.user.email = token.email ?? "";
      return session;
    },
  },
});
