"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const submitResponse = async (surveyId: string, answers: Record<string, any>) => {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "You must be logged in to submit." };
    }

    // Check if already submitted
    const existing = await db.response.findUnique({
        where: {
            surveyId_participantId: {
                surveyId,
                participantId: session.user.id
            }
        }
    });

    if (existing) {
        return { error: "You have already filled this survey." };
    }

    try {
        await db.response.create({
            data: {
                surveyId,
                participantId: session.user.id!,
                data: answers,
            }
        })
        revalidatePath(`/surveys/${surveyId}`);
        return { success: "Survey submitted successfully!" };

    } catch (e) {
        console.error(e);
        return { error: "Failed to submit survey." };
    }
};
