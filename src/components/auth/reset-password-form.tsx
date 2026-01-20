"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { CardWrapper } from "@/components/auth/card-wrapper";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/actions/password-reset";

const ResetPasswordSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6, { message: "OTP must be 6 digits" }),
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
    token: z.string(),
    confirmPassword: z.string().min(6, { message: "Minimum 6 characters required" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});


export const ResetPasswordForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email,
            otp: "",
            password: "",
            token,
            confirmPassword: "",
        },
    });
    useEffect(() => {
        if (email) form.setValue("email", email);
        if (token) form.setValue("token", token);
    }, [email, token, form]);

    const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            resetPassword(values).then((data) => {
                if (data?.error) {
                    setError(data.error);
                } else {
                    setSuccess(data?.success);
                    setTimeout(() => {
                        router.push("/auth/login");
                    }, 3000);
                }
            });
        });
    };

    if (!email || !token) {
        return (
            <CardWrapper
                title="Error"
                headerLabel="Invalid reset link"
                backButtonLabel="Go back"
                backButtonHref="/auth/forgot-password"
            >
                <div className="text-center text-destructive p-4">
                    The password reset session is invalid or missing. Please request a new code.
                </div>
            </CardWrapper>
        );
    }

    return (
        <AuthFormShell
            title="Reset Password"
            headerLabel={`Enter the code sent to ${email}`}
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
            error={error}
            success={success}
            buttonLabel="Reset Password"
        >
            <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>6-Digit Code</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                disabled={isPending}
                                placeholder="123456"
                                maxLength={6}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                disabled={isPending}
                                placeholder="******"
                                type="password"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                disabled={isPending}
                                placeholder="******"
                                type="password"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </AuthFormShell>
    );
};
