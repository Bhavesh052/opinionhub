// auth.config.edge.ts
import type { NextAuthConfig } from "next-auth";

export const authConfigEdge = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');
      const isAuthRoute = nextUrl.pathname.startsWith('/auth');

      if (isDashboardRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect to login page
      }

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }

      return true;
    },
  },
  providers: [], // Providers go in the main auth.ts, not here
} satisfies NextAuthConfig;