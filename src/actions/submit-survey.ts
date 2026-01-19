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
    const responseCount = await db.survey.findUnique({
        where: { id: surveyId },
        select: {
            limit: true,
            _count: {
                select: { responses: true },
            },
        }
    });

    if (responseCount?._count.responses == responseCount?.limit) {
        return { error: "Survey limit reached." };
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


export const getSurveyResponses = async (surveyId: string) => {
    try {
        const responses = await db.response.findMany({
            where: {
                surveyId
            },
            select: {
                data: true
            }
        });
        return responses;
    } catch (error) {
        console.error("Get Survey Responses Error", error);
        return [{ data: {} }]
    }
}

export const checkResponse = async(surveyId:string,participantId:string) => {
    try {
        const response = await db.response.findUnique({
        where: {
            surveyId_participantId: {
                surveyId,
                participantId
            }
        }
    });
    return response;
    } catch (error) {
        console.error("Check response error",error);
        return null;
    }
}