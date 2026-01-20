// middleware.ts
import NextAuth from "next-auth";
import { authConfigEdge } from "./auth.config.edge";

const { auth } = NextAuth(authConfigEdge);

// Export as default
export default auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};