import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "server/db/client";

// TODO
// roles
// account creation (admin only)
// custom auth pages
// hashed passwords

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      //console.log({ token });
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  //debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", defaultValue: "user" },
        password: { label: "Password", type: "password", defaultValue: "123" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { username, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { username: username },
        });

        if (!user) return null;
        if (user.password !== password) return null;

        return {
          id: user.id,
        };
      },
    }),
  ],
};

export default NextAuth(authOptions);
