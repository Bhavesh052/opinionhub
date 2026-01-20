"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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
import { changePassword } from "@/actions/change-password";

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string().min(6, { message: "Minimum 6 characters required" }),
    confirmPassword: z.string().min(6, { message: "Minimum 6 characters required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const ChangePasswordForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof ChangePasswordSchema>>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            changePassword(values).then((data) => {
                if (data?.error) {
                    setError(data.error);
                } else {
                    setSuccess(data?.success);
                    setTimeout(() => {
                        router.push("/profile");
                    }, 2000);
                }
            });
        });
    };

    return (
        <AuthFormShell
            title="Change Password"
            headerLabel="Securely update your password"
            backButtonLabel="Back to profile"
            backButtonHref="/profile"
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
            error={error}
            success={success}
            buttonLabel="Update Password"
        >
            <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current Password</FormLabel>
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
                name="newPassword"
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
