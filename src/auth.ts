import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        //@ts-ignore
        session.user.role = token.role as "SURVEYOR" | "PARTICIPANT"
      }

      return session
    },
    async jwt({ token, user }) {
      if (!token.sub) return token

      if (user) {
        //@ts-ignore
        token.role = user.role
        return token
      }

      if (token.role) return token

      const existingUser = await db.user.findUnique({
        where: { id: token.sub }
      })

      if (!existingUser) return token

      token.role = existingUser.role
      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  trustHost: true,
  ...authConfig,
})
