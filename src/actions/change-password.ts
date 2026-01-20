"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string().min(6, { message: "Minimum 6 characters required" }),
    confirmPassword: z.string().min(6, { message: "Minimum 6 characters required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const changePassword = async (values: z.infer<typeof ChangePasswordSchema>) => {
    const session = await auth();

    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    const validatedFields = ChangePasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    const existingUser = await db.user.findUnique({
        where: { id: session.user.id },
    });

    if (!existingUser || !existingUser.password) {
        return { error: "User not found!" };
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, existingUser.password);

    if (!passwordsMatch) {
        return { error: "Incorrect current password!" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        await db.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword },
        });

        return { success: "Password updated successfully!" };
    } catch (error) {
        return { error: "Failed to update password." };
    }
};
