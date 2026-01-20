"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthFormShell } from "@/components/auth/auth-form-shell";
import {
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
        <AuthFormShell
            title="Forgot Password"
            headerLabel="Reset your password"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
            error={error}
            success={success}
            buttonLabel="Send Reset Code"
        >
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
        </AuthFormShell>
    );
};
