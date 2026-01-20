"use client";

import { UseFormReturn } from "react-hook-form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface AuthFormShellProps {
    children: React.ReactNode;
    form: UseFormReturn<any>;
    onSubmit: (values: any) => void;
    isPending: boolean;
    error?: string;
    success?: string;
    buttonLabel: string;
    title: string;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
}

export const AuthFormShell = ({
    children,
    form,
    onSubmit,
    isPending,
    error,
    success,
    buttonLabel,
    title,
    headerLabel,
    backButtonLabel,
    backButtonHref,
}: AuthFormShellProps) => {
    return (
        <CardWrapper
            title={title}
            headerLabel={headerLabel}
            backButtonLabel={backButtonLabel}
            backButtonHref={backButtonHref}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {children}
                    </div>
                    {error && (
                        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                            <p>{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
                            <p>{success}</p>
                        </div>
                    )}
                    <Button disabled={isPending} type="submit" className="w-full">
                        {buttonLabel}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
