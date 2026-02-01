"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/user-nav";
import { User } from "next-auth";

interface NavbarClientProps {
    user?: User;
}

export const NavbarClient = ({ user }: NavbarClientProps) => {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 w-full z-50">
            <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between">
                <Link href="/" className="flex items-center font-bold text-xl group">
                    <img
                        src="/logo.svg"
                        alt="OpinionHub Logo"
                        className="w-20 h-20 object-contain"
                        // className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
                    />
                    <span className="hidden sm:inline-block leading-none">OpinionHub</span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <UserNav user={user} />
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/auth/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/auth/register">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
