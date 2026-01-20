"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    title: string;
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    title,
}: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <div className="w-full flex flex-col gap-y-2 items-center justify-center">
                    <img
                        src="/logo.svg"
                        alt="OpinionHub Logo"
                        className="w-20 h-20 mb-2 object-contain"
                    />
                    <h1 className="text-3xl font-semibold">{title}</h1>
                    <p className="text-muted-foreground text-sm">{headerLabel}</p>
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
            <CardFooter>
                <Button variant="link" className="font-normal w-full" size="sm" asChild>
                    <Link href={backButtonHref}>{backButtonLabel}</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
