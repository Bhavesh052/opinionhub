"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    role: z.enum(["SURVEYOR", "PARTICIPANT"]),
});

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, name, role } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        return { error: "Email already in use!" };
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
    });

    return { success: "Account created!" };
};
