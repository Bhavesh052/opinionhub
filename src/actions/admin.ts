"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export const getParticipantDemographics = async () => {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return { error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (user?.role !== "ADMIN") {
        return { error: "Forbidden" };
    }

    try {
        const participants = await db.user.findMany({
            where: {
                role: "PARTICIPANT"
            },
            select: {
                id: true,
                name: true,
                email: true,
                demographics: true,
                createdAt: true,
            }
        });

        return { data: participants };
    } catch (error) {
        return { error: "Failed to fetch demographics" };
    }
};
