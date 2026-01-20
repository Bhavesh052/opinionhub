"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";

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
import { login } from "@/actions/login";
import Link from "next/link";

const LoginSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values).then((data) => {
                setError(data?.error);
            });
        });
    };

    return (
        <AuthFormShell
            title="Opinion Hub"
            headerLabel="Login"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
            error={error}
            success={success}
            buttonLabel="Login"
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
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                disabled={isPending}
                                placeholder="******"
                                type="password"
                            />
                        </FormControl>
                        <Button
                            size="sm"
                            variant="link"
                            asChild
                            className="px-0 font-normal"
                        >
                            <Link href="/auth/forgot-password">
                                Forgot password?
                            </Link>
                        </Button>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </AuthFormShell>
    );
};
