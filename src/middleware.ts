import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
    const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');

    if (isDashboardRoute && !isLoggedIn) {
        return Response.redirect(new URL('/auth/login', req.nextUrl));
    }

    if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', req.nextUrl));
    }
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
