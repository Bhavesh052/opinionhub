"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { generateOTP, generateStatelessResetToken, verifyStatelessResetToken } from "@/lib/tokens-stateless";
import { sendPasswordResetEmail } from "@/lib/mail";

const ForgotPasswordSchema = z.object({
    email: z.string().email(),
});

const ResetPasswordSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
    password: z.string().min(6),
    token: z.string(), 
     confirmPassword: z.string().min(6, { message: "Minimum 6 characters required" }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const requestPasswordReset = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    const validatedFields = ForgotPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid email!" };
    }

    const { email } = validatedFields.data;

    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (!existingUser) {
        // For security reasons, don't reveal that the user doesn't exist
        return { success: "No user found" };
    }

    const otp = generateOTP();
    const verificationToken = generateStatelessResetToken(email, otp);

    try {
        await sendPasswordResetEmail(email, otp);
        return {
            success: "Reset code sent to your email.",
            verificationToken // Client needs this to verify OTP statelessly
        };
    } catch (error) {
        console.error("Mail Error:", error);
        return { error: "Failed to send email. Please try again later." };
    }
};

export const resetPassword = async (values: z.infer<typeof ResetPasswordSchema>) => {
    const validatedFields = ResetPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, otp, password, token } = validatedFields.data;
    const verified = verifyStatelessResetToken(token);

    if (!verified || verified.email !== email || verified.otp !== otp) {
        return { error: "Invalid or expired reset code." };
    }

    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (!existingUser) {
        return { error: "User not found!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword },
        });

        return { success: "Password reset successful!" };
    } catch (error) {
        return { error: "Failed to update password." };
    }
};
