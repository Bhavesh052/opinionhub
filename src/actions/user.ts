"use server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
const UpdateProfileSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email" }),
});
export const getUserRole = async(id:string) => {
    try {
       const role= await db.user.findUnique({
        where: { id },
        select: { role: true }
    });
    return role;
    } catch (error) {
        logger.error("Get User Role Error", error);
        return null;
    }
}
export const updateProfile = async (values: z.infer<typeof UpdateProfileSchema>) => {
    const session = await auth();

    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    const validatedFields = UpdateProfileSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { name, email } = validatedFields.data;

    // Optional: Check if email is already taken if it's changing
    if (email !== session.user.email) {
        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "Email already in use!" };
        }
    }

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: { name, email },
        });

        revalidatePath("/profile");
        return { success: "Profile updated successfully!" };
    } catch (error) {
        return { error: "Failed to update profile." };
    }
};