"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { CardWrapper } from "@/components/auth/card-wrapper";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/actions/password-reset";

const ForgotPasswordSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
});

export const ForgotPasswordForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get("email") || "";

    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: initialEmail,
        },
    });

    useEffect(() => {
        if (initialEmail) {
            form.setValue("email", initialEmail);
        }
    }, [initialEmail, form]);

    const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            requestPasswordReset(values).then((data) => {
                if (data?.error) {
                    setError(data.error);
                } else {
                    setSuccess(data?.success);
                    // If we have a verification token, we might want to automatically redirect to reset page
                    // and pass the token and email in the URL or state
                    if (data?.verificationToken) {
                        const params = new URLSearchParams();
                        params.set("email", values.email);
                        params.set("token", data.verificationToken);

                        setTimeout(() => {
                            router.push(`/auth/reset-password?${params.toString()}`);
                        }, 2000);
                    }
                }
            });
        });
    };

    return (
        <CardWrapper
            title="Forgot Password"
            headerLabel="Reset your password"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Suspense fallback={<div>Loading...</div>}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="john.doe@example.com"
                                                type="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            Send Reset Code
                        </Button>
                    </form>
                </Form>
            </Suspense>
        </CardWrapper>
    );
};
